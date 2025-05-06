import React from "react";

const AlertDialog = ({
    text,
    onConfirm,
    onCancel,
    confirmText,
    cancelText,
    loading = false,
}) => {
    return (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white rounded-lg shadow-lg p-6 w-80">
                <p className="text-gray-800 text-lg font-semibold mb-4">{text}</p>
                <div className="flex justify-end space-x-4">
                    {loading ? <div>
                        Loading...
                    </div> : <>
                        <button
                            onClick={onCancel}
                            className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition"
                        >
                            {cancelText}
                        </button>
                        <button
                            onClick={onConfirm}
                            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
                        >
                            {confirmText}
                        </button>
                    </>}
                </div>
            </div>
        </div>
    );
};

export default AlertDialog;
