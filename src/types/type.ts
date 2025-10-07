import { User } from "@supabase/supabase-js";
import { Tables } from "./db.types";

export type UserType = Tables<"users"> & User
export type CourseType = Tables<"courses">