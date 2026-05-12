import * as z from 'zod'

export const UploadDocumentSchema =  z.object({
    title: z.string().min(1, 'Title is required'),
    subject: z.string().min(1, 'Subject is required'),
    description: z.string().optional(),
    file: z.file("File is required"),
    startTime: z.string().min(1, 'Start time is required'),
    endTime: z.string().min(1, 'End time is required'),
    rotationDuration: z.number().optional(),
}).refine((d) => new Date(d.endTime) > new Date(d.startTime), {
    message: 'End time must be after start time',
    path: ['endTime'],
});