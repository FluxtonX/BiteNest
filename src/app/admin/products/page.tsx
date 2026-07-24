'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { FiPlus, FiEdit2, FiTrash2, FiX, FiCheck, FiShoppingBag, FiStar } from 'react-icons/fi';
import { Product } from '@/types/models';
import { getProducts, saveProduct, deleteProduct } from '@/services/firestore';

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Partial<Product> | null>(null);

  useEffect(() => {
    loadProducts();
  }, []);

  async function loadProducts() {
    const data = await getProducts();
    setProducts(data);
    setLoading(false);
  }

  const handleOpenAdd = () => {
    setEditingProduct({
      name: '',
      slug: '',
      description: '',
      category: 'burgers',
      price: 15.0,
      discountPercentage: 0,
      preparationTime: '15-20 min',
      images: ['https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80'],
      ingredients: ['Fresh Ingredients'],
      isAvailable: true,
      isPopular: false,
      isFeatured: false,
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (prod: Product) => {
    setEditingProduct(prod);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this product?')) {
      await deleteProduct(id);
      loadProducts();
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct?.name) return;

    const slug = editingProduct.slug || editingProduct.name.toLowerCase().replace(/\s+/g, '-');
    const price = Number(editingProduct.price) || 10;
    const discount = Number(editingProduct.discountPercentage) || 0;
    const discountPrice = discount > 0 ? price - (price * discount) / 100 : price;

    await saveProduct({
      ...editingProduct,
      slug,
      price,
      discountPercentage: discount,
      discountPrice,
    });

    setIsModalOpen(false);
    loadProducts();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white">Product Management</h1>
          <p className="text-xs text-slate-400">Create, edit, or remove food dishes from your online menu</p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="rounded-xl bg-brand-500 px-4 py-2.5 text-xs font-bold text-white hover:bg-brand-600 shadow-md flex items-center gap-1.5"
        >
          <FiPlus className="h-4 w-4" /> Add New Dish
        </button>
      </div>

      {/* Table */}
      <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-xl overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="border-b border-slate-200 dark:border-slate-800 text-slate-400 font-bold uppercase">
            <tr>
              <th className="pb-3">Dish</th>
              <th className="pb-3">Category</th>
              <th className="pb-3">Price</th>
              <th className="pb-3">Discount</th>
              <th className="pb-3">Prep Time</th>
              <th className="pb-3">Status</th>
              <th className="pb-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {products.map((prod) => (
              <tr key={prod.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                <td className="py-3">
                  <div className="flex items-center gap-3">
                    <div className="relative h-12 w-12 flex-shrink-0 overflow-hidden rounded-xl bg-slate-100 dark:bg-slate-800">
                      <Image src={prod.images[0]} alt={prod.name} fill className="object-cover" />
                    </div>
                    <div>
                      <div className="font-bold text-slate-900 dark:text-white">{prod.name}</div>
                      <div className="text-[10px] text-slate-400 line-clamp-1">{prod.description}</div>
                    </div>
                  </div>
                </td>
                <td className="py-3">
                  <span className="rounded-full bg-brand-500/10 px-2.5 py-1 text-[10px] font-bold text-brand-500 uppercase">
                    {prod.category}
                  </span>
                </td>
                <td className="py-3 font-bold text-slate-900 dark:text-white">${prod.price.toFixed(2)}</td>
                <td className="py-3">
                  {prod.discountPercentage > 0 ? (
                    <span className="text-red-500 font-bold">{prod.discountPercentage}% OFF</span>
                  ) : (
                    <span className="text-slate-400">None</span>
                  )}
                </td>
                <td className="py-3 text-slate-500">{prod.preparationTime}</td>
                <td className="py-3">
                  <span
                    className={`rounded-full px-2.5 py-1 text-[10px] font-bold ${
                      prod.isAvailable
                        ? 'bg-emerald-500/10 text-emerald-500'
                        : 'bg-red-500/10 text-red-500'
                    }`}
                  >
                    {prod.isAvailable ? 'Available' : 'Sold Out'}
                  </span>
                </td>
                <td className="py-3 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => handleOpenEdit(prod)}
                      className="rounded-lg bg-slate-100 dark:bg-slate-800 p-2 text-slate-600 dark:text-slate-300 hover:bg-brand-500 hover:text-white"
                    >
                      <FiEdit2 className="h-3.5 w-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(prod.id)}
                      className="rounded-lg bg-slate-100 dark:bg-slate-800 p-2 text-slate-600 dark:text-slate-300 hover:bg-red-500 hover:text-white"
                    >
                      <FiTrash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add / Edit Modal */}
      {isModalOpen && editingProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md">
          <div className="relative w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-2xl space-y-4">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              <FiX className="h-5 w-5" />
            </button>

            <h3 className="text-xl font-bold text-slate-900 dark:text-white">
              {editingProduct.id ? 'Edit Dish' : 'Add New Dish'}
            </h3>

            <form onSubmit={handleSave} className="space-y-4 text-xs font-bold">
              <div>
                <label className="block text-slate-700 dark:text-slate-300 mb-1">Dish Name *</label>
                <input
                  type="text"
                  required
                  value={editingProduct.name || ''}
                  onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-3 font-medium text-slate-900 dark:text-white focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 mb-1">Category</label>
                  <select
                    value={editingProduct.category || 'burgers'}
                    onChange={(e) => setEditingProduct({ ...editingProduct, category: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-3 font-medium text-slate-900 dark:text-white focus:outline-none"
                  >
                    <option value="burgers">Burgers</option>
                    <option value="pizza">Pizza</option>
                    <option value="bbq">BBQ</option>
                    <option value="shawarma">Shawarma</option>
                    <option value="chinese">Chinese</option>
                    <option value="desserts">Desserts</option>
                    <option value="drinks">Drinks</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 dark:text-slate-300 mb-1">Price ($) *</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={editingProduct.price || 0}
                    onChange={(e) => setEditingProduct({ ...editingProduct, price: Number(e.target.value) })}
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-3 font-medium text-slate-900 dark:text-white focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 mb-1">Discount %</label>
                  <input
                    type="number"
                    value={editingProduct.discountPercentage || 0}
                    onChange={(e) => setEditingProduct({ ...editingProduct, discountPercentage: Number(e.target.value) })}
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-3 font-medium text-slate-900 dark:text-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 dark:text-slate-300 mb-1">Prep Time</label>
                  <input
                    type="text"
                    value={editingProduct.preparationTime || '15 min'}
                    onChange={(e) => setEditingProduct({ ...editingProduct, preparationTime: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-3 font-medium text-slate-900 dark:text-white focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 mb-1">Image URL</label>
                <input
                  type="text"
                  value={editingProduct.images?.[0] || ''}
                  onChange={(e) => setEditingProduct({ ...editingProduct, images: [e.target.value] })}
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-3 font-medium text-slate-900 dark:text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 mb-1">Description</label>
                <textarea
                  rows={3}
                  value={editingProduct.description || ''}
                  onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-3 font-medium text-slate-900 dark:text-white focus:outline-none"
                />
              </div>

              <div className="flex items-center gap-4 pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingProduct.isAvailable ?? true}
                    onChange={(e) => setEditingProduct({ ...editingProduct, isAvailable: e.target.checked })}
                    className="accent-brand-500"
                  />
                  <span>Is Available</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingProduct.isFeatured ?? false}
                    onChange={(e) => setEditingProduct({ ...editingProduct, isFeatured: e.target.checked })}
                    className="accent-brand-500"
                  />
                  <span>Featured on Home</span>
                </label>
              </div>

              <button
                type="submit"
                className="w-full rounded-xl bg-brand-500 py-3 text-xs font-bold text-white hover:bg-brand-600 shadow-md"
              >
                Save Product
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
