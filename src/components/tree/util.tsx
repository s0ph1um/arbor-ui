import axios from "axios";
import { notifications } from "@mantine/notifications";

export const getErrorMessage = (error: unknown, fallbackMessage: string) => axios.isAxiosError(error) ? error?.response?.data.message : fallbackMessage;

export const notifyOnTreeStructureChange = (message: string) => {
  notifications.show({
    title: "Tree updated",
    color: "yellow",
    autoClose: false,
    message: (
      <span>
        {message}{" "}
        <button
          type="button"
          style={{
            background: "none",
            border: "none",
            padding: 0,
            fontFamily: "inherit",
            fontSize: "inherit",
            fontWeight: 500,
            color: "var(--mantine-color-blue-text, #228be6)",
            textDecoration: "underline",
            cursor: "pointer"
          }}
          onClick={() => window.location.reload()}
        >
          Refresh the page to see latest changes
        </button>
      </span>
    )
  });
};
