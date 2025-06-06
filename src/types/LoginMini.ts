// types/LoginMini.ts
import { z } from "zod";

export const loginMiniSchema = z.object({
    phone: z
        .string()
        .min(10, "error_phone_min_digits")
        .regex(/^[0-9]{10}$/, "error_phone_min_digits"),
    role: z.enum(["citizen", "helper"], {
        required_error: "role_is_required",
    }),
});

export type LoginMini = z.infer<typeof loginMiniSchema>;
