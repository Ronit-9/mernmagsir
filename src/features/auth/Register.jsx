"use client";

import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { useRegisterMutation } from "../../services/authApi.js";
import { useNavigate, Link } from "react-router-dom";
import { useState } from "react";

const RegisterSchema = Yup.object().shape({
  username: Yup.string().min(3, "At least 3 characters").required("Username is required"),
  email: Yup.string().email("Invalid email address").required("Email is required"),
  password: Yup.string().min(6, "At least 6 characters").required("Password is required"),
});

export default function Register() {
  const [registerUser] = useRegisterMutation();
  const nav = useNavigate();
  const [serverError, setServerError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      const { username, email, password } = values;
      await registerUser({ username, email, password }).unwrap();
      toast.success("Registration successful");
      nav("/login");
    } catch (error) {
      setServerError(error?.data?.msg || "Registration failed");
      toast.error(error?.data?.msg || "Registration failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f5f7fb] px-4 py-8">
      <div className="w-full max-w-md">

        <div className="text-center mb-6">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Socially</h2>
          <p className="text-sm text-gray-500 mt-1">Create your account</p>
        </div>

        <Card className="w-full rounded-3xl border-0 shadow-xl bg-white">
          <CardContent className="p-6 sm:p-8">

            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-1">Create Account</h1>
            <p className="text-sm text-gray-500 mb-6">Join Socially and start connecting</p>

            <Formik
              initialValues={{ username: "", email: "", password: "" }}
              validationSchema={RegisterSchema}
              onSubmit={handleSubmit}
            >
              {({ isSubmitting }) => (
                <Form className="space-y-4">

                  <div className="space-y-1.5">
                    <Label htmlFor="username">Username</Label>
                    <Field as={Input} id="username" name="username" type="text"
                      placeholder="Enter username"
                      className="h-11 rounded-xl border-gray-200 text-sm" />
                    <ErrorMessage name="username" component="p" className="text-red-500 text-xs" />
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="email">Email</Label>
                    <Field as={Input} id="email" name="email" type="email"
                      placeholder="Enter your email" autoComplete="email"
                      className="h-11 rounded-xl border-gray-200 text-sm" />
                    <ErrorMessage name="email" component="p" className="text-red-500 text-xs" />
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="password">Password</Label>
                    <div className="relative">
                      <Field as={Input} id="password" name="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Create password"
                        className="h-11 rounded-xl border-gray-200 pr-16 text-sm" />
                      <button type="button"
                        onClick={() => setShowPassword((p) => !p)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-500 hover:text-black font-medium">
                        {showPassword ? "Hide" : "Show"}
                      </button>
                    </div>
                    <ErrorMessage name="password" component="p" className="text-red-500 text-xs" />
                  </div>

                  {serverError && (
                    <p className="text-red-500 text-sm text-center">{serverError}</p>
                  )}

                  <Button type="submit" disabled={isSubmitting}
                    className="w-full h-11 rounded-xl bg-black hover:bg-gray-900 text-white text-sm font-medium mt-2">
                    {isSubmitting ? "Creating account..." : "Register"}
                  </Button>

                </Form>
              )}
            </Formik>

            <p className="text-center text-sm text-gray-500 mt-6">
              Already have an account?{" "}
              <Link to="/login" className="text-black font-semibold hover:underline">Login</Link>
            </p>

          </CardContent>
        </Card>
      </div>
    </div>
  );
}