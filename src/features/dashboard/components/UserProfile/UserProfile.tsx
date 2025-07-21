"use client";

import { useState } from "react";
import { useApiQuery, useApiMutation } from "@/services/api";
import { User } from "@/features/auth/types/auth";
import { API_ENDPOINTS } from "@/constants";
import { HttpMethod } from "@/types";

export interface UserProfileProps {
  initialData?: User;
  userId: string;
}

export function UserProfile({ initialData }: UserProfileProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<Partial<User>>({});

  // Fetch user data with TanStack Query
  const {
    data: userData,
    isLoading,
    error,
  } = useApiQuery<User>(`${API_ENDPOINTS.USER.PROFILE}`, ["user", "profile"], {
    initialData,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  // Save user profile data with TanStack Query mutation
  const { mutate: updateProfile, isPending: isSaving } = useApiMutation<
    User,
    Partial<User>
  >({
    endpoint: `${API_ENDPOINTS.USER.PROFILE}`,
    method: HttpMethod.PUT,
    onSuccess: () => {
      setIsEditing(false);
      // Form reset would happen here
    },
    onError: (error) => {
      console.error("Failed to update profile:", error);
      // Error handling would happen here
    },
  });

  if (isLoading) {
    return (
      <div className="p-4 border rounded shadow-sm">
        Loading user profile...
      </div>
    );
  }

  if (error || !userData) {
    return (
      <div className="p-4 border rounded text-red-500">
        Failed to load user profile
      </div>
    );
  }

  const handleEdit = () => {
    setFormData({
      name: userData.name,
      email: userData.email,
      // Add other editable fields
    });
    setIsEditing(true);
  };

  const handleSave = () => {
    updateProfile(formData);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setFormData({});
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="p-4 border rounded shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">User Profile</h2>
        {!isEditing ? (
          <button
            onClick={handleEdit}
            className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Edit Profile
          </button>
        ) : (
          <div className="space-x-2">
            <button
              onClick={handleCancel}
              className="px-3 py-1 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
              disabled={isSaving}
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
              disabled={isSaving}
            >
              {isSaving ? "Saving..." : "Save"}
            </button>
          </div>
        )}
      </div>

      {isEditing ? (
        <div className="space-y-3">
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700"
            >
              Name
            </label>
            <input
              id="name"
              type="text"
              name="name"
              value={formData.name || ""}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              placeholder="Enter your name"
            />
          </div>
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              name="email"
              value={formData.email || ""}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              placeholder="Enter your email"
            />
          </div>
        </div>
      ) : (
        <div className="space-y-2">
          <div>
            <span className="font-medium">Name:</span> {userData.name}
          </div>
          <div>
            <span className="font-medium">Email:</span> {userData.email}
          </div>
          <div>
            <span className="font-medium">Role:</span> {userData.role}
          </div>
          <div>
            <span className="font-medium">Last Active:</span>{" "}
            {new Date().toLocaleString()}
          </div>
        </div>
      )}
    </div>
  );
}
