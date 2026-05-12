'use client';

import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import z from 'zod'
import { useRouter } from 'next/navigation';
import { UploadDocumentSchema } from '@/schemas/uploadSchema'
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { toast } from 'sonner';
import { Textarea } from '../ui/textarea';
import { UploadCloud, FileText, Type, BookOpen, Clock, RefreshCw, CheckCircle2, FileUp, X, File as FileIcon } from 'lucide-react';
import contentService from '@/services/contentService';

const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png'];
const MAX_SIZE = 10 * 1024 * 1024; 

export default function UploadDocument() {

    const router = useRouter();

    const [isUploading, setIsUploading] = useState(false);

    const form = useForm<z.infer<typeof UploadDocumentSchema>>({
        resolver: zodResolver(UploadDocumentSchema),
        defaultValues: {
            title: "title",
            subject: "subject",
            description: "description"
        },
    })
    const { register, handleSubmit, formState: { errors } } = form

    async function onSubmit(data: z.infer<typeof UploadDocumentSchema>) {

        setIsUploading(true);

        const formData = new FormData();
        formData.append('file', data.file);
        formData.append('title', data.title);
        formData.append('subject', data.subject);
        formData.append('description', data.description ?? '');
        formData.append('startTime', data.startTime);
        formData.append('endTime', data.endTime);
        formData.append('rotationDuration', String(data.rotationDuration || ''));

        try {
            const res = await contentService.create(formData)
            if (res?.success) {
                setIsUploading(false);
                toast.success(res?.message || "Document uploaded succssfully", { position: "top-center", richColors: true })
                router.push('/teacher/my-content');
            }
            else {
                setIsUploading(false);
                toast.error(res?.message || "Document uploading failed", { position: "top-center", richColors: true })

            }
        } catch (error: any) {
            setIsUploading(false);
        }
    }

    return (
        <div className="w-full max-w-4xl mx-auto p-6 md:p-8 bg-white dark:bg-zinc-900 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 dark:border-zinc-800 transition-all duration-300 hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)]">
            <div className="mb-8 space-y-2">
                <div className="inline-flex items-center justify-center p-3 bg-blue-50 dark:bg-blue-500/10 rounded-xl mb-2">
                    <UploadCloud className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white tracking-tight">
                    Upload Content
                </h2>
                <p className="text-gray-500 dark:text-gray-400 text-sm md:text-base">
                    Share your learning materials securely. Fill in the details to publish your document.
                </p>
            </div>

            <form id="upload-form" onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Title */}
                    <Controller
                        name="title"
                        control={form.control}
                        render={({ field, fieldState }) => (
                            <div className="space-y-2">
                                <label htmlFor="upload-form-title" className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                                    <Type className="w-4 h-4 text-gray-400" /> Title *
                                </label>
                                <Input
                                    {...field}
                                    id="upload-form-title"
                                    aria-invalid={fieldState.invalid}
                                    placeholder="Enter Document Title"
                                    autoComplete="off"
                                    className="h-11 transition-all focus:ring-2 focus:ring-blue-500/20"
                                />
                                {fieldState.invalid && (
                                    <p className="text-xs text-red-500 flex items-center gap-1 mt-1">
                                        <span className="w-1 h-1 rounded-full bg-red-500"></span>
                                        {fieldState.error?.message}
                                    </p>
                                )}
                            </div>
                        )}
                    />

                    {/* Subject */}
                    <Controller
                        name="subject"
                        control={form.control}
                        render={({ field, fieldState }) => (
                            <div className="space-y-2">
                                <label htmlFor="upload-form-subject" className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                                    <BookOpen className="w-4 h-4 text-gray-400" /> Subject *
                                </label>
                                <Input
                                    {...field}
                                    id="upload-form-subject"
                                    aria-invalid={fieldState.invalid}
                                    placeholder="Enter Subject Name"
                                    autoComplete="off"
                                    className="h-11 transition-all focus:ring-2 focus:ring-blue-500/20"
                                />
                                {fieldState.invalid && (
                                    <p className="text-xs text-red-500 flex items-center gap-1 mt-1">
                                        <span className="w-1 h-1 rounded-full bg-red-500"></span>
                                        {fieldState.error?.message}
                                    </p>
                                )}
                            </div>
                        )}
                    />
                </div>

                {/* Description */}
                <Controller
                    name="description"
                    control={form.control}
                    render={({ field, fieldState }) => (
                        <div className="space-y-2">
                            <label htmlFor="upload-form-description" className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                                <FileText className="w-4 h-4 text-gray-400" /> Description
                            </label>
                            <Textarea
                                {...field}
                                id="upload-form-description"
                                aria-invalid={fieldState.invalid}
                                placeholder="Write a brief description about this content..."
                                autoComplete="off"
                                className="min-h-[100px] resize-y transition-all focus:ring-2 focus:ring-blue-500/20"
                            />
                            {fieldState.invalid && (
                                <p className="text-xs text-red-500 flex items-center gap-1 mt-1">
                                    <span className="w-1 h-1 rounded-full bg-red-500"></span>
                                    {fieldState.error?.message}
                                </p>
                            )}
                        </div>
                    )}
                />

                {/* Time & Duration Settings */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-gray-50/50 dark:bg-zinc-800/30 p-5 rounded-2xl border border-gray-100 dark:border-zinc-800">
                    <Controller
                        name="startTime"
                        control={form.control}
                        render={() => (
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                                    <Clock className="w-4 h-4 text-gray-400" /> Start Time *
                                </label>
                                <input
                                    type="datetime-local"
                                    {...register('startTime')}
                                    className={`w-full h-11 border rounded-xl px-3 py-2 text-sm outline-none transition-all dark:bg-zinc-900 dark:border-zinc-700
                                        ${errors.startTime
                                            ? 'border-red-300 focus:border-red-400 focus:ring-2 focus:ring-red-500/20'
                                            : 'border-gray-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20'
                                        }`}
                                />
                                {errors.startTime && (
                                    <p className="text-xs text-red-500 flex items-center gap-1 mt-1">
                                        <span className="w-1 h-1 rounded-full bg-red-500"></span>
                                        {errors.startTime.message}
                                    </p>
                                )}
                            </div>
                        )}
                    />

                    <Controller
                        name="endTime"
                        control={form.control}
                        render={() => (
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                                    <Clock className="w-4 h-4 text-gray-400" /> End Time *
                                </label>
                                <input
                                    type="datetime-local"
                                    {...register('endTime')}
                                    className={`w-full h-11 border rounded-xl px-3 py-2 text-sm outline-none transition-all dark:bg-zinc-900 dark:border-zinc-700
                                        ${errors.endTime
                                            ? 'border-red-300 focus:border-red-400 focus:ring-2 focus:ring-red-500/20'
                                            : 'border-gray-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20'
                                        }`}
                                />
                                {errors.endTime && (
                                    <p className="text-xs text-red-500 flex items-center gap-1 mt-1">
                                        <span className="w-1 h-1 rounded-full bg-red-500"></span>
                                        {errors.endTime.message}
                                    </p>
                                )}
                            </div>
                        )}
                    />

                    <Controller
                        name="rotationDuration"
                        control={form.control}
                        render={({ field, fieldState }) => (
                            <div className="space-y-2">
                                <label htmlFor="upload-form-rotationDuration" className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                                    <RefreshCw className="w-4 h-4 text-gray-400" /> Rotation (sec)
                                </label>
                                <Input
                                    {...field}
                                    value={field.value ?? ''}
                                    onChange={(e) => field.onChange(e.target.value === '' ? undefined : Number(e.target.value))}
                                    type='number'
                                    id="upload-form-rotationDuration"
                                    aria-invalid={fieldState.invalid}
                                    placeholder="e.g. 10"
                                    className="h-11 transition-all focus:ring-2 focus:ring-blue-500/20"
                                />
                                {fieldState.invalid && (
                                    <p className="text-xs text-red-500 flex items-center gap-1 mt-1">
                                        <span className="w-1 h-1 rounded-full bg-red-500"></span>
                                        {fieldState.error?.message}
                                    </p>
                                )}
                            </div>
                        )}
                    />
                </div>

                {/* File Upload */}
                <Controller
                    name="file"
                    control={form.control}
                    render={({ field: { onChange, onBlur, name, ref, value }, fieldState }) => (
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                                <FileUp className="w-4 h-4 text-gray-400" /> Upload Document *
                            </label>
                            {value ? (
                                <div className="relative flex items-center justify-between p-4 border rounded-2xl bg-blue-50/50 dark:bg-blue-500/10 border-blue-200 dark:border-blue-500/30">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/50 text-blue-600 rounded-lg flex items-center justify-center">
                                            <FileIcon className="w-5 h-5" />
                                        </div>
                                        <div className="overflow-hidden">
                                            <p className="text-sm font-medium text-gray-900 dark:text-white truncate max-w-[200px] md:max-w-md">
                                                {(value as File).name}
                                            </p>
                                            <p className="text-xs text-gray-500">
                                                {((value as File).size / 1024 / 1024).toFixed(2)} MB
                                            </p>
                                        </div>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => onChange(undefined)}
                                        className="p-2 text-gray-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-full transition-colors shrink-0"
                                    >
                                        <X className="w-5 h-5" />
                                    </button>
                                </div>
                            ) : (
                                <div className={`relative group w-full flex justify-center px-6 pt-5 pb-6 border-2 border-dashed rounded-2xl transition-all duration-300
                                    ${fieldState.invalid ? 'border-red-300 bg-red-50/50 dark:bg-red-900/10' : 'border-gray-300 dark:border-zinc-700 hover:border-blue-500 hover:bg-blue-50/50 dark:hover:bg-blue-500/5'}
                                `}>
                                    <div className="space-y-2 text-center">
                                        <div className="mx-auto w-12 h-12 bg-gray-100 dark:bg-zinc-800 text-gray-500 dark:text-gray-400 rounded-full flex items-center justify-center group-hover:bg-blue-100 group-hover:text-blue-600 transition-colors">
                                            <UploadCloud className="w-6 h-6" />
                                        </div>
                                        <div className="flex text-sm text-gray-600 dark:text-gray-400 justify-center">
                                            <label htmlFor="document-upload" className="relative cursor-pointer rounded-md font-medium text-blue-600 dark:text-blue-400 hover:text-blue-500 focus-within:outline-none">
                                                <span>Click to upload</span>
                                                <input
                                                    type="file"
                                                    id="document-upload"
                                                    name={name}
                                                    ref={ref}
                                                    onBlur={onBlur}
                                                    onChange={(e) => {
                                                        const files = e.target.files;
                                                        onChange(files?.[0]);
                                                    }}
                                                    className="sr-only"
                                                    aria-invalid={fieldState.invalid}
                                                />
                                            </label>
                                            <p className="pl-1">or drag and drop</p>
                                        </div>
                                        <p className="text-xs text-gray-500 dark:text-gray-500">
                                            PDF, PPTX, MP4 up to 10MB
                                        </p>
                                    </div>
                                </div>
                            )}
                            {fieldState.invalid && (
                                <p className="text-xs text-red-500 flex items-center gap-1 mt-1">
                                    <span className="w-1 h-1 rounded-full bg-red-500"></span>
                                    {fieldState.error?.message}
                                </p>
                            )}
                        </div>
                    )}
                />

                <div className="pt-6 border-t border-gray-100 dark:border-zinc-800 flex justify-end">
                    <Button
                        type="submit"
                        form="upload-form"
                        disabled={isUploading}
                        className={`w-full md:w-auto min-w-[180px] h-12 text-base font-medium rounded-xl transition-all duration-300 shadow-md hover:shadow-lg
                            ${(isUploading) ? 'bg-blue-400 cursor-not-allowed opacity-90' : 'bg-blue-600 hover:bg-blue-700 hover:-translate-y-0.5'}
                            text-white flex items-center justify-center gap-2`}
                    >
                        {isUploading ? (
                            <>
                                <RefreshCw className="w-5 h-5 animate-spin" />
                                <span>Uploading...</span>
                            </>
                        ) : (
                            <>
                                <CheckCircle2 className="w-5 h-5" />
                                <span>Submit Document</span>
                            </>
                        )}
                    </Button>
                </div>

            </form>
        </div>
    )
}