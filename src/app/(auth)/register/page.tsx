'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';
import { Eye, EyeOff, UserPlus, ShieldCheck } from 'lucide-react';

const schema = z.object({
  name:     z.string().min(1, 'Name is required').min(2, 'Name must be at least 2 characters'),
  email:    z.string().min(1, 'Email is required').email('Enter a valid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirm:  z.string().min(1, 'Please confirm your password'),
  role:     z.enum(['teacher', 'principal']),
  principalCode: z.string().optional(),
}).refine((d) => d.password === d.confirm, {
  message: 'Passwords do not match',
  path: ['confirm'],
}).refine(
  (d) => d.role !== 'principal' || (d.principalCode && d.principalCode.trim().length > 0),
  {
    message: 'Principal code is required',
    path: ['principalCode'],
  }
);

type FormValues = z.infer<typeof schema>;

export default function RegisterPage() {
  const { register: registerUser } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { role: 'teacher' },
  });

  const selectedRole = watch('role');

  const onSubmit = async (values: FormValues) => {
    setServerError(null);
    try {
      await registerUser(
        values.name,
        values.email,
        values.password,
        values.role,
        values.principalCode
      );
    } catch (err: any) {
      setServerError(
        err?.response?.data?.error || 'Registration failed. Please try again.'
      );
    }
  };

  return (
    <div className="w-full max-w-md">
      {/* Card */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8 space-y-6">

        {/* Header */}
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold text-gray-900 tracking-tight">
            Create account
          </h1>
          <p className="text-sm text-gray-400">
            Join EduBroadcast as a teacher or principal
          </p>
        </div>

        {/* Server Error */}
        {serverError && (
          <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-lg">
            {serverError}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

          {/* Name */}
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">Full Name</label>
            <input
              {...register('name')}
              type="text"
              placeholder="John Smith"
              autoComplete="name"
              className={`w-full border rounded-lg px-3 py-2.5 text-sm outline-none transition-colors
                ${errors.name
                  ? 'border-red-300 focus:border-red-400'
                  : 'border-gray-200 focus:border-gray-400'
                }`}
            />
            {errors.name && (
              <p className="text-xs text-red-500">{errors.name.message}</p>
            )}
          </div>

          {/* Email */}
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">Email</label>
            <input
              {...register('email')}
              type="email"
              placeholder="you@school.com"
              autoComplete="email"
              className={`w-full border rounded-lg px-3 py-2.5 text-sm outline-none transition-colors
                ${errors.email
                  ? 'border-red-300 focus:border-red-400'
                  : 'border-gray-200 focus:border-gray-400'
                }`}
            />
            {errors.email && (
              <p className="text-xs text-red-500">{errors.email.message}</p>
            )}
          </div>

          {/* Role Selector */}
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">Role</label>
            <div className="grid grid-cols-2 gap-2">
              {(['teacher', 'principal'] as const).map((role) => (
                <label
                  key={role}
                  className={`flex items-center justify-center gap-2 border rounded-lg px-3 py-2.5 cursor-pointer transition-colors text-sm font-medium
                    ${selectedRole === role
                      ? 'border-gray-900 bg-gray-900 text-white'
                      : 'border-gray-200 text-gray-500 hover:border-gray-300'
                    }`}
                >
                  <input
                    {...register('role')}
                    type="radio"
                    value={role}
                    className="hidden"
                  />
                  <ShieldCheck size={14} />
                  <span className="capitalize">{role}</span>
                </label>
              ))}
            </div>
            {errors.role && (
              <p className="text-xs text-red-500">{errors.role.message}</p>
            )}
          </div>

          {/* Principal Code — only shown when principal is selected */}
          {selectedRole === 'principal' && (
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">
                Principal Code
              </label>
              <input
                {...register('principalCode')}
                type="text"
                placeholder="Enter your school's principal code"
                className={`w-full border rounded-lg px-3 py-2.5 text-sm outline-none transition-colors
                  ${errors.principalCode
                    ? 'border-red-300 focus:border-red-400'
                    : 'border-gray-200 focus:border-gray-400'
                  }`}
              />
              {errors.principalCode && (
                <p className="text-xs text-red-500">{errors.principalCode.message}</p>
              )}
              <p className="text-xs text-gray-400">
                Contact your school admin for this code
              </p>
            </div>
          )}

          {/* Password */}
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">Password</label>
            <div className="relative">
              <input
                {...register('password')}
                type={showPassword ? 'text' : 'password'}
                placeholder="Min. 6 characters"
                autoComplete="new-password"
                className={`w-full border rounded-lg px-3 py-2.5 text-sm outline-none transition-colors pr-10
                  ${errors.password
                    ? 'border-red-300 focus:border-red-400'
                    : 'border-gray-200 focus:border-gray-400'
                  }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
            {errors.password && (
              <p className="text-xs text-red-500">{errors.password.message}</p>
            )}
          </div>

          {/* Confirm Password */}
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">
              Confirm Password
            </label>
            <div className="relative">
              <input
                {...register('confirm')}
                type={showConfirm ? 'text' : 'password'}
                placeholder="Re-enter your password"
                autoComplete="new-password"
                className={`w-full border rounded-lg px-3 py-2.5 text-sm outline-none transition-colors pr-10
                  ${errors.confirm
                    ? 'border-red-300 focus:border-red-400'
                    : 'border-gray-200 focus:border-gray-400'
                  }`}
              />
              <button
                type="button"
                onClick={() => setShowConfirm(!showConfirm)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showConfirm ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
            {errors.confirm && (
              <p className="text-xs text-red-500">{errors.confirm.message}</p>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full flex items-center justify-center gap-2 bg-gray-900 text-white py-2.5 rounded-lg text-sm font-medium hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-2"
          >
            {isSubmitting ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <UserPlus size={15} />
            )}
            {isSubmitting ? 'Creating account...' : 'Create account'}
          </button>
        </form>

        {/* Divider */}
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-100" />
          </div>
          <div className="relative flex justify-center text-xs text-gray-400 bg-white px-2 w-fit mx-auto">
            already have an account?
          </div>
        </div>

        {/* Login Link */}
        <Link
          href="/login"
          className="w-full flex items-center justify-center border border-gray-200 text-gray-700 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
        >
          Sign in instead
        </Link>
      </div>
    </div>
  );
}