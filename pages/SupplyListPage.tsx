
import React, { useState, useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '../services/supabase';
import { DetailedSupplyListItem } from '../types';
import { useCart } from '../contexts/CartContext';
import { useToast } from '../contexts/ToastContext';

const SupplyListPage: React.FC = () => {
  const { listId } = useParams<{ listId: string }>();
  const [listItems, setListItems] = useState<DetailedSupplyListItem[]>([]);
  const [listInfo, setListInfo] = useState<{ gradeName: string; schoolName: string; year: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedItems, setSelectedItems] = useState<Record<string, boolean>>({});
  
  const { addToCart } = useCart();
  const { showToast } = useToast();

  useEffect(() => {
    const fetchSupplyList = async () => {
      if (!listId) return;

      setLoading(true);
      setError(null);
      
      try {
        const { data, error } = await supabase
          .from('supply_list_items')
          .select(`
            id,
            quantity,
            products (*),
            supply_lists (
              academic_year,
              grade_levels (
                name,
                schools (name)
              )
            )
          `)
          .eq('supply_list_id', listId);

        if (error) throw error;
        
        // Fix: Cast `data` to `any[]` to work around Supabase's incorrect `never[]` type inference for complex queries.
        if (data && data.length > 0) {
          const typedData = data as any[];
          const transformedData = typedData.map(item => ({
            id: item.id,
            quantity: item.quantity,
            product: item.products,
          }));
          setListItems(transformedData);

          const listDetails = typedData[0].supply_lists;
          setListInfo({
            gradeName: listDetails.grade_levels.name,
            schoolName: listDetails.grade_levels.schools.name,
            year: listDetails.academic_year
          });
          
          // Pre-select all items
          const initialSelection = transformedData.reduce((acc, item) => {
            acc[item.id] = true;
            return acc;
          }, {} as Record<string, boolean>);
          setSelectedItems(initialSelection);
        } else {
            setError('Supply list not found or is empty.');
        }

      } catch (err: any) {
        console.error(err);
        setError(err.message || 'Failed to fetch supply list.');
      } finally {
        setLoading(false);
      }
    };

    fetchSupplyList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [listId]);
  
  const handleToggleItem = (itemId: string) => {
    setSelectedItems(prev => ({ ...prev, [itemId]: !prev[itemId] }));
  };
  
  const handleAddSelectedToCart = () => {
    const itemsToAdd = listItems.filter(item => selectedItems[item.id]);
    itemsToAdd.forEach(item => addToCart(item));
    showToast(`${itemsToAdd.length} item(s) added to cart`);
  };
  
  const selectedCount = Object.values(selectedItems).filter(Boolean).length;

  const groupedItems = useMemo(() => {
    return listItems.reduce((acc, item) => {
      const category = item.product.category || 'Uncategorized';
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(item);
      return acc;
    }, {} as Record<string, DetailedSupplyListItem[]>);
  }, [listItems]);

  if (loading) return <div className="text-center py-10">Loading supply list...</div>;
  if (error) return <div className="text-center py-10 text-red-500">{error}</div>;

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">{listInfo?.gradeName} Supply List</h1>
            <p className="text-gray-600">{listInfo?.schoolName} &bull; Academic Year {listInfo?.year}</p>
          </div>
          <div className="bg-green-100 text-green-800 text-sm font-semibold px-3 py-1 rounded-full">
            {selectedCount} of {listItems.length} items
          </div>
        </div>
        
        <div className="space-y-8">
          {Object.entries(groupedItems).map(([category, items]) => (
            <div key={category}>
              <h2 className="text-xl font-semibold text-gray-700 border-b pb-2 mb-4 flex justify-between">
                <span>{category}</span>
                <span className="text-sm font-normal bg-gray-200 text-gray-700 rounded-full px-2 py-0.5">{items.length}</span>
              </h2>
              <ul className="space-y-3">
                {items.map(item => (
                  <li key={item.id} className="flex items-center justify-between p-4 bg-white rounded-lg shadow-sm border border-gray-200">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        checked={selectedItems[item.id] || false}
                        onChange={() => handleToggleItem(item.id)}
                        className="h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <div className="ml-4">
                        <p className="font-medium text-gray-800">{item.product.name}</p>
                        <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-800">{item.product.price * item.quantity} MAD</p>
                      <p className="text-sm text-gray-500">per unit</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="sticky bottom-0 bg-white/80 backdrop-blur-sm py-4 mt-8 -mx-4 px-4 border-t">
          <button 
            onClick={handleAddSelectedToCart}
            disabled={selectedCount === 0}
            className="w-full bg-orange-500 text-white font-bold py-3 px-6 rounded-lg shadow-md hover:bg-orange-600 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed">
            Add {selectedCount} Selected Items to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default SupplyListPage;
