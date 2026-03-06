// src/Pages/AnalystRegistration.jsx
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Upload, Loader2, CheckCircle, XCircle, FileText } from "lucide-react";
import axios from "axios";

const AnalystRegistration = () => {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    credentialType: "PATENT_AGENT",
    credentialNumber: "",
  });

  const [files, setFiles] = useState({
    patentAgentLicense: null,
    lawCouncilId: null,
    companyProof: null,
    researchInstitutionProof: null,
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const credentialTypes = [
    { value: "PATENT_AGENT", label: "Patent Agent", requires: "patentAgentLicense" },
    { value: "LAW_COUNCIL", label: "Law Council Member", requires: "lawCouncilId" },
    { value: "COMPANY", label: "Company Employee", requires: "companyProof" },
    { value: "RESEARCH_INSTITUTION", label: "Research Institution", requires: "researchInstitutionProof" },
  ];

  const validate = () => {
    const newErrors = {};

    if (!formData.firstName.trim()) newErrors.firstName = "First name is required";
    if (!formData.lastName.trim()) newErrors.lastName = "Last name is required";
    
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Enter a valid email address";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    if (!formData.credentialNumber) {
      newErrors.credentialNumber = "Credential number is required";
    }

    // Check required file based on credential type
    const selectedType = credentialTypes.find(t => t.value === formData.credentialType);
    if (selectedType) {
      const requiredFile = files[selectedType.requires];
      if (!requiredFile) {
        newErrors[selectedType.requires] = "This document is required for your credential type";
      }
    }

    return newErrors;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const handleFileChange = (e, fieldName) => {
    const file = e.target.files[0];
    if (file) {
      // Check file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        setErrors(prev => ({ ...prev, [fieldName]: "File size must be less than 10MB" }));
        return;
      }
      
      // Check file type
      const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png'];
      if (!allowedTypes.includes(file.type)) {
        setErrors(prev => ({ ...prev, [fieldName]: "Only PDF, JPEG, and PNG files are allowed" }));
        return;
      }

      setFiles(prev => ({ ...prev, [fieldName]: file }));
      if (errors[fieldName]) {
        setErrors(prev => ({ ...prev, [fieldName]: "" }));
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);
    setErrorMessage("");

    const formDataToSend = new FormData();
    formDataToSend.append("firstName", formData.firstName);
    formDataToSend.append("lastName", formData.lastName);
    formDataToSend.append("email", formData.email);
    formDataToSend.append("password", formData.password);
    formDataToSend.append("credentialType", formData.credentialType);
    formDataToSend.append("credentialNumber", formData.credentialNumber);

    // Append files (only if they exist)
    if (files.patentAgentLicense) {
      formDataToSend.append("patentAgentLicense", files.patentAgentLicense);
    }
    if (files.lawCouncilId) {
      formDataToSend.append("lawCouncilId", files.lawCouncilId);
    }
    if (files.companyProof) {
      formDataToSend.append("companyProof", files.companyProof);
    }
    if (files.researchInstitutionProof) {
      formDataToSend.append("researchInstitutionProof", files.researchInstitutionProof);
    }

    // Log FormData contents for debugging
    for (let pair of formDataToSend.entries()) {
      console.log(pair[0] + ': ' + (pair[1] instanceof File ? pair[1].name : pair[1]));
    }

    try {
      // Submit the form directly - remove the test endpoint call
      const response = await axios.post(
        "http://localhost:8080/api/analyst-registration/submit",
        formDataToSend,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log("Submission response:", response.data);
      setSuccessMessage(response.data.message || "Request submitted successfully!");
      
      // Clear any existing auth state
      localStorage.removeItem("accessToken");
      localStorage.removeItem("user");
      
      // Navigate to login after 3 seconds
      setTimeout(() => {
        navigate("/login", { 
          state: { 
            message: "Your analyst registration request has been submitted! ",
            fromRegistration: true 
          },
          replace: true
        });
      }, 3000);
      
    } catch (error) {
      console.error("Submission error:", error);
      if (error.response) {
        console.error("Error response data:", error.response.data);
        console.error("Error response status:", error.response.status);
        setErrorMessage(error.response.data || "Submission failed. Please try again.");
      } else if (error.request) {
        console.error("No response received:", error.request);
        setErrorMessage("Cannot connect to server. Please check if backend is running.");
      } else {
        console.error("Error:", error.message);
        setErrorMessage("Error: " + error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const getFileIcon = (fileName) => {
    if (!fileName) return null;
    const ext = fileName.split('.').pop().toLowerCase();
    if (ext === 'pdf') return <FileText className="text-red-500" size={20} />;
    return <FileText className="text-blue-500" size={20} />;
  };

  const selectedCredentialType = credentialTypes.find(t => t.value === formData.credentialType);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 dark:from-gray-900 dark:to-gray-950 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
            Analyst Registration
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-2">
            Submit your credentials for admin approval
          </p>
        </div>

        {/* Messages */}
        {successMessage && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 text-green-700 rounded-lg flex items-center gap-2">
            <CheckCircle size={20} />
            <p>{successMessage}</p>
          </div>
        )}

        {errorMessage && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg flex items-center gap-2">
            <XCircle size={20} />
            <p>{errorMessage}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 space-y-6">
          
          {/* Personal Information */}
          <div className="border-b border-gray-200 dark:border-gray-700 pb-6">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
              Personal Information
            </h2>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">
                  First Name
                </label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-2 rounded-lg border ${
                    errors.firstName
                      ? "border-red-500 bg-red-50"
                      : "border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700"
                  } focus:ring-2 focus:ring-blue-500 focus:outline-none dark:text-white`}
                />
                {errors.firstName && (
                  <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">
                  Last Name
                </label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-2 rounded-lg border ${
                    errors.lastName
                      ? "border-red-500 bg-red-50"
                      : "border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700"
                  } focus:ring-2 focus:ring-blue-500 focus:outline-none dark:text-white`}
                />
                {errors.lastName && (
                  <p className="text-red-500 text-xs mt-1">{errors.lastName}</p>
                )}
              </div>
            </div>

            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">
                Work Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className={`w-full px-4 py-2 rounded-lg border ${
                  errors.email
                    ? "border-red-500 bg-red-50"
                    : "border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700"
                } focus:ring-2 focus:ring-blue-500 focus:outline-none dark:text-white`}
              />
              {errors.email && (
                <p className="text-red-500 text-xs mt-1">{errors.email}</p>
              )}
            </div>
          </div>

          {/* Password Section */}
          <div className="border-b border-gray-200 dark:border-gray-700 pb-6">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
              Security
            </h2>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-2 rounded-lg border ${
                    errors.password
                      ? "border-red-500 bg-red-50"
                      : "border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700"
                  } focus:ring-2 focus:ring-blue-500 focus:outline-none dark:text-white`}
                />
                {errors.password && (
                  <p className="text-red-500 text-xs mt-1">{errors.password}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">
                  Confirm Password
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-2 rounded-lg border ${
                    errors.confirmPassword
                      ? "border-red-500 bg-red-50"
                      : "border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700"
                } focus:ring-2 focus:ring-blue-500 focus:outline-none dark:text-white`}
                />
                {errors.confirmPassword && (
                  <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>
                )}
              </div>
            </div>
          </div>

          {/* Professional Information */}
          <div className="border-b border-gray-200 dark:border-gray-700 pb-6">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
              Professional Information
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">
                  Credential Type
                </label>
                <select
                  name="credentialType"
                  value={formData.credentialType}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 focus:ring-2 focus:ring-blue-500 focus:outline-none dark:text-white"
                >
                  {credentialTypes.map(type => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">
                  Credential Number / License ID
                </label>
                <input
                  type="text"
                  name="credentialNumber"
                  value={formData.credentialNumber}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-2 rounded-lg border ${
                    errors.credentialNumber
                      ? "border-red-500 bg-red-50"
                      : "border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700"
                  } focus:ring-2 focus:ring-blue-500 focus:outline-none dark:text-white`}
                />
                {errors.credentialNumber && (
                  <p className="text-red-500 text-xs mt-1">{errors.credentialNumber}</p>
                )}
              </div>
            </div>
          </div>

          {/* Document Upload Section */}
          <div className="pb-6">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
              Required Documents
            </h2>

            <div className="space-y-6">
              {/* Patent Agent License */}
              {credentialTypes.find(t => t.value === formData.credentialType)?.requires === "patentAgentLicense" && (
                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Patent Agent License <span className="text-red-500">*</span>
                  </label>
                  <div className="flex items-center gap-4">
                    <label className="flex-1 flex items-center gap-3 px-4 py-3 bg-white dark:bg-gray-700 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer hover:border-blue-500 transition">
                      <Upload size={20} className="text-gray-500" />
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        {files.patentAgentLicense?.name || "Upload PDF/JPEG/PNG (Max 10MB)"}
                      </span>
                      <input
                        type="file"
                        className="hidden"
                        accept=".pdf,.jpg,.jpeg,.png"
                        onChange={(e) => handleFileChange(e, "patentAgentLicense")}
                      />
                    </label>
                    {files.patentAgentLicense && getFileIcon(files.patentAgentLicense.name)}
                  </div>
                  {errors.patentAgentLicense && (
                    <p className="text-red-500 text-xs mt-1">{errors.patentAgentLicense}</p>
                  )}
                </div>
              )}

              {/* Law Council ID */}
              {credentialTypes.find(t => t.value === formData.credentialType)?.requires === "lawCouncilId" && (
                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Law Council ID <span className="text-red-500">*</span>
                  </label>
                  <div className="flex items-center gap-4">
                    <label className="flex-1 flex items-center gap-3 px-4 py-3 bg-white dark:bg-gray-700 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer hover:border-blue-500 transition">
                      <Upload size={20} className="text-gray-500" />
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        {files.lawCouncilId?.name || "Upload PDF/JPEG/PNG (Max 10MB)"}
                      </span>
                      <input
                        type="file"
                        className="hidden"
                        accept=".pdf,.jpg,.jpeg,.png"
                        onChange={(e) => handleFileChange(e, "lawCouncilId")}
                      />
                    </label>
                    {files.lawCouncilId && getFileIcon(files.lawCouncilId.name)}
                  </div>
                  {errors.lawCouncilId && (
                    <p className="text-red-500 text-xs mt-1">{errors.lawCouncilId}</p>
                  )}
                </div>
              )}

              {/* Company Employment Proof */}
              {credentialTypes.find(t => t.value === formData.credentialType)?.requires === "companyProof" && (
                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Company Employment Proof <span className="text-red-500">*</span>
                  </label>
                  <div className="flex items-center gap-4">
                    <label className="flex-1 flex items-center gap-3 px-4 py-3 bg-white dark:bg-gray-700 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer hover:border-blue-500 transition">
                      <Upload size={20} className="text-gray-500" />
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        {files.companyProof?.name || "Upload PDF/JPEG/PNG (Max 10MB)"}
                      </span>
                      <input
                        type="file"
                        className="hidden"
                        accept=".pdf,.jpg,.jpeg,.png"
                        onChange={(e) => handleFileChange(e, "companyProof")}
                      />
                    </label>
                    {files.companyProof && getFileIcon(files.companyProof.name)}
                  </div>
                  {errors.companyProof && (
                    <p className="text-red-500 text-xs mt-1">{errors.companyProof}</p>
                  )}
                </div>
              )}

              {/* Research Institution Proof */}
              {credentialTypes.find(t => t.value === formData.credentialType)?.requires === "researchInstitutionProof" && (
                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Research Institution Proof <span className="text-red-500">*</span>
                  </label>
                  <div className="flex items-center gap-4">
                    <label className="flex-1 flex items-center gap-3 px-4 py-3 bg-white dark:bg-gray-700 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer hover:border-blue-500 transition">
                      <Upload size={20} className="text-gray-500" />
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        {files.researchInstitutionProof?.name || "Upload PDF/JPEG/PNG (Max 10MB)"}
                      </span>
                      <input
                        type="file"
                        className="hidden"
                        accept=".pdf,.jpg,.jpeg,.png"
                        onChange={(e) => handleFileChange(e, "researchInstitutionProof")}
                      />
                    </label>
                    {files.researchInstitutionProof && getFileIcon(files.researchInstitutionProof.name)}
                  </div>
                  {errors.researchInstitutionProof && (
                    <p className="text-red-500 text-xs mt-1">{errors.researchInstitutionProof}</p>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 px-4 rounded-lg font-semibold text-white transition ${
              loading
                ? "bg-blue-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            } flex items-center justify-center gap-2`}
          >
            {loading ? (
              <>
                <Loader2 size={20} className="animate-spin" />
                Submitting Request...
              </>
            ) : (
              "Submit Analyst Registration Request"
            )}
          </button>

          <p className="text-sm text-center text-gray-500 dark:text-gray-400 mt-4">
            Already have an account?{" "}
            <Link to="/login" className="text-blue-600 hover:underline">
              Sign In
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default AnalystRegistration;