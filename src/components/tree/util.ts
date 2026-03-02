import axios from "axios";

export const getErrorMessage = (error: unknown, fallbackMessage: string) => axios.isAxiosError(error) ? error?.response?.data.message : fallbackMessage;
