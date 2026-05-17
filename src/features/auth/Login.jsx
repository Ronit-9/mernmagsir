"use client";

import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { useLoginMutation } from "../../services/authApi.js";
import { useDispatch } from "react-redux";
import { setUser } from "../../services/userSlice.js";
import { useNavigate, Link } from "react-router-dom";
import { useState } from "react";

const LoginSchema = Yup.object().shape({
  email: Yup.string().email("Invalid email address").required("Email is required"),
  password: Yup.string().min(6, "Password must be at least 6 characters").required("Password is required"),
});

export default function Login() {
  const dispatch = useDispatch();
  const [loginUser] = useLoginMutation();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      const response = await loginUser(values).unwrap();
      dispatch(setUser(response));
      toast.success(`Welcome back ${response.user.username}`);
      navigate("/");
    } catch (error) {
      toast.error(error?.data?.msg || "Login failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f5f7fb] px-4 py-8">
      <div className="w-full max-w-md">

        <div className="text-center mb-6">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Socially</h2>
          <p className="text-sm text-gray-500 mt-1">Sign in to continue</p>
        </div>

        <Card className="w-full rounded-3xl border-0 shadow-xl bg-white">
          <CardContent className="p-6 sm:p-8">

            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-1">Login</h1>
            <p className="text-sm text-gray-500 mb-6">Welcome back to Socially</p>

            <Formik
              initialValues={{ email: "", password: "" }}
              validationSchema={LoginSchema}
              onSubmit={handleSubmit}
            >
              {({ isSubmitting }) => (
                <Form className="space-y-4">

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
                        placeholder="Enter your password"
                        autoComplete="current-password"
                        className="h-11 rounded-xl border-gray-200 pr-16 text-sm" />
                      <button type="button"
                        onClick={() => setShowPassword((p) => !p)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-500 hover:text-black font-medium">
                        {showPassword ? "Hide" : "Show"}
                      </button>
                    </div>
                    <ErrorMessage name="password" component="p" className="text-red-500 text-xs" />
                  </div>

                  <Button type="submit" disabled={isSubmitting}
                    className="w-full h-11 rounded-xl bg-black hover:bg-gray-900 text-white text-sm font-medium mt-2">
                    {isSubmitting ? "Logging in..." : "Login"}
                  </Button>

                </Form>
              )}
            </Formik>

            <p className="text-center text-sm text-gray-500 mt-6">
              Don't have an account?{" "}
              <Link to="/register" className="text-black font-semibold hover:underline">Register</Link>
            </p>

          </CardContent>
        </Card>
      </div>
    </div>
  );
}