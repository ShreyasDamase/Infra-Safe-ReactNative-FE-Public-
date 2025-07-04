import { z } from "zod";

// Define the document picker result schema
export const documentPickerResultSchema = z.object({
    base64: z.string(),
    uri: z.string(),
    name: z.string().optional(),
    mimeType: z.string().optional(),
    size: z.number().optional(),
    lastModified: z.number().optional(),

});

export type DocumentPickerResult = z.infer<typeof documentPickerResultSchema>;
export type Gender = "male" | "female";

export const helperRegistrationSchema = z.object({
    id: z.string().optional(),
    role: z.literal("helper"),
    name: z.string().min(1, "error_name_required"),
    gender: z.enum(["male", "female"]),
    dob: z.string().refine((val) => !isNaN(Date.parse(val)), "error_invalid_date"),
    phone: z.string().min(10, "error_phone_min_digits"),
    adhaarNo: z.string().length(12, "error_adhaar_length"),
    country: z.string().min(1, "error_country_required"),
    states: z.string().min(1, "error_states_required"),
    pinCode: z.string().regex(/^\d{6}$/, "error_invalid_pincode"),
    address: z.string().min(1, "error_address_required"),
    profileImage: documentPickerResultSchema.optional(),
    documents: z.array(documentPickerResultSchema).min(1, "error_documents_required"),
    department: z.string().min(1, "error_department_required"),
    departmentPost: z.string().min(1, "error_department_post_required"),


});

export type Helper = z.infer<typeof helperRegistrationSchema>;