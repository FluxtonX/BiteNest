'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { FiPlus, FiTrash2, FiX } from 'react-icons/fi';
import { Category } from '@/types/models';
import { getCategories, saveCategory, deleteCategory } from '@/services/firestore';

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [image, setImage] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    loadCategories();
  }, []);

  async function loadCategories() {
    const data = await getCategories();
    setCategories(data);
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const slug = name.toLowerCase().replace(/\s+/g, '-');
    await saveCategory({
      name,
      slug,
      image: image || 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=600&q=80',
      description,
      itemCount: 0,
    });

    setIsModalOpen(false);
    setName('');
    setImage('');
    setDescription('');
    loadCategories();
  };

  const handleDelete = async (id: string) => {
    if (confirm('Delete this category?')) {
      await deleteCategory(id);
      loadCategories();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white">Categories Management</h1>
          <p className="text-xs text-slate-400">Add or remove food categories</p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="rounded-xl bg-brand-500 px-4 py-2.5 text-xs font-bold text-white hover:bg-brand-600 shadow-md flex items-center gap-1.5"
        >
          <FiPlus className="h-4 w-4" /> Add Category
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((cat) => (
          <div
            key={cat.id}
            className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 shadow-sm flex items-center justify-between gap-4"
          >
            <div className="flex items-center gap-3">
              <div className="relative h-14 w-14 overflow-hidden rounded-xl bg-slate-100 dark:bg-slate-800 flex-shrink-0">
                <Image src={cat.image} alt={cat.name} fill className="object-cover" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">{cat.name}</h4>
                <p className="text-[10px] text-slate-400 line-clamp-1">{cat.description}</p>
              </div>
            </div>

            <button
              onClick={() => handleDelete(cat.id)}
              className="text-slate-400 hover:text-red-500 p-2"
            >
              <FiTrash2 className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md">
          <div className="relative w-full max-w-md rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-2xl space-y-4">
            <button onClick={() => setIsModalOpen(false)} className="absolute top-4 right-4 text-slate-400">
              <FiX className="h-5 w-5" />
            </button>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">Add Category</h3>

            <form onSubmit={handleSave} className="space-y-4 text-xs font-bold">
              <div>
                <label className="block mb-1">Category Name *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-3 font-medium text-slate-900 dark:text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block mb-1">Image URL</label>
                <input
                  type="text"
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-3 font-medium text-slate-900 dark:text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block mb-1">Description</label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-3 font-medium text-slate-900 dark:text-white focus:outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full rounded-xl bg-brand-500 py-3 text-xs font-bold text-white hover:bg-brand-600 shadow-md"
              >
                Save Category
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
