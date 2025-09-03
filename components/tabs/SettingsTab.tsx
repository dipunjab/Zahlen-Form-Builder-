import { Eye, EyeOff, Loader2, Trash2 } from 'lucide-react'
import React from 'react'

const SettingsTab = ({ form, toggling, togglePublish, deleteForm, deleting }:any) => {
  return (
    <div className="space-y-4">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <h3 className="text-sm font-semibold">Publishing</h3>
                    <p className="text-sm text-gray-500">Control whether this form is publicly accessible.</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={togglePublish}
                      disabled={toggling}
                      className={`px-4 py-2 rounded-md text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#FFBF00]/40 ${
                        form.published ? "bg-[#FFBF00] text-black" : "bg-white text-gray-700 border"
                      }`}
                    >
                      {toggling ? (<span className="flex items-center gap-2"><Loader2 className="animate-spin" size={16} /> Processing</span>) : form.published ? (<><EyeOff size={14}/> Unpublish</>) : (<><Eye size={14}/> Publish</>) }
                    </button>
                  </div>
                </div>

                <div className="p-4 rounded-lg border bg-white">
                  <h3 className="text-sm font-semibold">Danger zone</h3>
                  <p className="text-sm text-gray-500 mt-1">Deleting the form will remove all responses permanently.</p>
                  <div className="mt-4">
                    <button
                      onClick={deleteForm}
                      disabled={deleting}
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-red-600 text-white"
                    >
                      {deleting ? <Loader2 className="animate-spin" size={14} /> : <Trash2 size={14} />}
                      <span>{deleting ? "Deleting…" : "Delete form"}</span>
                    </button>
                  </div>
                </div>
              </div>
  )
}

export default SettingsTab
