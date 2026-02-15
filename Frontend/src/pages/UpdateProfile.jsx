import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { authAPI } from "@/services/api";

const UpdateProfile = () => {
const navigate = useNavigate();

const [formData, setFormData] = useState({
firstName: "",
lastName: "",
email: "",
phone: "",
location: "",
occupation: "",
age: "",
bio: ""
});

const [loading, setLoading] = useState(true);
const [saving, setSaving] = useState(false);

/* ---------------- FETCH USER DATA ---------------- */

useEffect(() => {
const fetchUser = async () => {
try {
const res = await authAPI.getCurrentUser();

    if (res.data.success) {
      const u = res.data.user;

      setFormData({
        firstName: u.firstName || "",
        lastName: u.lastName || "",
        email: u.email || "",
        phone: u.phone || "",
        location: u.location || "",
        occupation: u.occupation || "",
        age: u.age || "",
        bio: u.bio || ""
      });
    }
  } catch (err) {
    console.log("User not logged in");
    navigate("/login");
  } finally {
    setLoading(false);
  }
};

fetchUser();


}, [navigate]);

/* ---------------- INPUT CHANGE ---------------- */

const handleChange = (e) => {
setFormData({
...formData,
[e.target.name]: e.target.value,
});
};

/* ---------------- SAVE PROFILE ---------------- */

const handleSubmit = async (e) => {
e.preventDefault();
setSaving(true);


try {
  const res = await authAPI.updateProfile(formData);

  if (res.data.success) {
    alert("Profile updated successfully!");
    navigate("/profile");
  }
} catch (err) {
  alert("Update failed");
} finally {
  setSaving(false);
}


};

if (loading) return <div className="p-10 text-center">Loading user...</div>;

return ( <div className="min-h-screen bg-gray-50"> <Header />

```
  <div className="max-w-3xl mx-auto bg-white mt-10 p-8 rounded-xl shadow">
    <h2 className="text-2xl font-bold mb-6">Update Profile</h2>

    <form onSubmit={handleSubmit} className="space-y-4">

      <input name="firstName" value={formData.firstName} onChange={handleChange} placeholder="First Name" className="w-full border p-3 rounded"/>
      <input name="lastName" value={formData.lastName} onChange={handleChange} placeholder="Last Name" className="w-full border p-3 rounded"/>
      <input name="email" value={formData.email} disabled className="w-full border p-3 rounded bg-gray-100"/>
      <input name="phone" value={formData.phone} onChange={handleChange} placeholder="Phone" className="w-full border p-3 rounded"/>
      <input name="age" value={formData.age} onChange={handleChange} placeholder="Age" className="w-full border p-3 rounded"/>
      <input name="location" value={formData.location} onChange={handleChange} placeholder="Location" className="w-full border p-3 rounded"/>
      <input name="occupation" value={formData.occupation} onChange={handleChange} placeholder="Occupation" className="w-full border p-3 rounded"/>

      <textarea name="bio" value={formData.bio} onChange={handleChange} placeholder="Bio" className="w-full border p-3 rounded"/>

      <button
        type="submit"
        disabled={saving}
        className="bg-purple-600 text-white px-6 py-3 rounded-lg w-full"
      >
        {saving ? "Saving..." : "Save Changes"}
      </button>
    </form>
  </div>

  <Footer />
</div>


);
};

export default UpdateProfile;
