import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowLeft, Building2 } from "lucide-react";

const industries = [
  "Technology",
  "Finance",
  "Healthcare",
  "Manufacturing",
  "Retail",
  "Consulting",
  "Software Development",
  "Education",
  "Telecommunications",
  "Energy",
  "Construction",
  "Real Estate",
  "Other",
];

const subscriptionPlans = [
  { value: "starter", label: "Starter - ₦9,900/month" },
  { value: "professional", label: "Professional - ₦24,900/month" },
  { value: "enterprise", label: "Enterprise - ₦99,900/month" },
];

export default function AddCompany() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    industry: "",
    email: "",
    phone: "",
    address: "",
    website: "",
    employees: "",
    subscriptionPlan: "starter",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error for this field
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error for this field
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) newErrors.name = "Company name is required";
    if (!formData.industry) newErrors.industry = "Industry is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
      newErrors.email = "Please enter a valid email";
    if (!formData.phone.trim()) newErrors.phone = "Phone number is required";
    if (!formData.address.trim()) newErrors.address = "Address is required";
    if (!formData.employees) newErrors.employees = "Number of employees is required";
    else if (isNaN(parseInt(formData.employees)))
      newErrors.employees = "Please enter a valid number";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Navigate back to companies list with success
      navigate("/companies");
    } catch (error) {
      console.error("Error adding company:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur-xl">
        <div className="container mx-auto px-4 h-20 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate("/companies")}
              className="p-2 rounded-lg hover:bg-muted transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <div>
              <h1 className="font-display font-bold text-2xl">Add New Company</h1>
              <p className="text-sm text-muted-foreground">Register a new company to the platform</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 max-w-2xl">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5" />
                Company Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Company Name */}
                <div>
                  <Label htmlFor="name">Company Name *</Label>
                  <Input
                    id="name"
                    name="name"
                    placeholder="e.g., Acme Technologies"
                    value={formData.name}
                    onChange={handleInputChange}
                    className={errors.name ? "border-red-500" : ""}
                  />
                  {errors.name && (
                    <p className="text-sm text-red-500 mt-1">{errors.name}</p>
                  )}
                </div>

                {/* Industry & Employees */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="industry">Industry *</Label>
                    <Select
                      value={formData.industry}
                      onValueChange={(value) =>
                        handleSelectChange("industry", value)
                      }
                    >
                      <SelectTrigger
                        id="industry"
                        className={errors.industry ? "border-red-500" : ""}
                      >
                        <SelectValue placeholder="Select industry" />
                      </SelectTrigger>
                      <SelectContent>
                        {industries.map((industry) => (
                          <SelectItem key={industry} value={industry}>
                            {industry}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.industry && (
                      <p className="text-sm text-red-500 mt-1">{errors.industry}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="employees">Number of Employees *</Label>
                    <Input
                      id="employees"
                      name="employees"
                      type="number"
                      placeholder="e.g., 45"
                      value={formData.employees}
                      onChange={handleInputChange}
                      className={errors.employees ? "border-red-500" : ""}
                    />
                    {errors.employees && (
                      <p className="text-sm text-red-500 mt-1">
                        {errors.employees}
                      </p>
                    )}
                  </div>
                </div>

                {/* Email & Phone */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="email">Email Address *</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="admin@company.com"
                      value={formData.email}
                      onChange={handleInputChange}
                      className={errors.email ? "border-red-500" : ""}
                    />
                    {errors.email && (
                      <p className="text-sm text-red-500 mt-1">{errors.email}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="phone">Phone Number *</Label>
                    <Input
                      id="phone"
                      name="phone"
                      placeholder="+234 (0) 1 234 5678"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className={errors.phone ? "border-red-500" : ""}
                    />
                    {errors.phone && (
                      <p className="text-sm text-red-500 mt-1">{errors.phone}</p>
                    )}
                  </div>
                </div>

                {/* Address */}
                <div>
                  <Label htmlFor="address">Business Address *</Label>
                  <Input
                    id="address"
                    name="address"
                    placeholder="Street address, city, state"
                    value={formData.address}
                    onChange={handleInputChange}
                    className={errors.address ? "border-red-500" : ""}
                  />
                  {errors.address && (
                    <p className="text-sm text-red-500 mt-1">{errors.address}</p>
                  )}
                </div>

                {/* Website */}
                <div>
                  <Label htmlFor="website">Website (Optional)</Label>
                  <Input
                    id="website"
                    name="website"
                    placeholder="www.company.com"
                    value={formData.website}
                    onChange={handleInputChange}
                  />
                </div>

                {/* Subscription Plan */}
                <div className="pt-4 border-t border-border">
                  <Label htmlFor="subscriptionPlan">Subscription Plan *</Label>
                  <Select
                    value={formData.subscriptionPlan}
                    onValueChange={(value) =>
                      handleSelectChange("subscriptionPlan", value)
                    }
                  >
                    <SelectTrigger id="subscriptionPlan">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {subscriptionPlans.map((plan) => (
                        <SelectItem key={plan.value} value={plan.value}>
                          {plan.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground mt-2">
                    Select the subscription plan for this company.
                  </p>
                </div>

                {/* Form Actions */}
                <div className="flex gap-3 pt-6 border-t border-border">
                  <Button
                    type="button"
                    variant="outline"
                    className="flex-1"
                    onClick={() => navigate("/companies")}
                    disabled={isLoading}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="flex-1"
                    disabled={isLoading}
                  >
                    {isLoading ? "Adding Company..." : "Add Company"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </main>
    </div>
  );
}
