export type LoginActionState = {
  message: string;
  status: "error" | "idle" | "success";
};

export const initialLoginActionState: LoginActionState = {
  message: "",
  status: "idle",
};
