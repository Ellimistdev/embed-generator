import { parseISO } from "date-fns";
import { CustomCommandWire } from "../api/wire";
import Tooltip from "./Tooltip";
import {
  ClipboardIcon,
  PencilSquareIcon,
  TrashIcon,
} from "@heroicons/react/20/solid";
import { useState } from "react";
import { AutoAnimate } from "../util/autoAnimate";
import {
  useCustomCommandDeleteMutation,
  useCustomCommandUpdateMutation,
} from "../api/mutations";
import { useSendSettingsStore } from "../state/sendSettings";
import { useQueryClient } from "react-query";
import { useToasts } from "../util/toasts";

export default function CustomCommand({ cmd }: { cmd: CustomCommandWire }) {
  const guildId = useSendSettingsStore((s) => s.guildId);
  const createToast = useToasts((s) => s.create);

  const [manage, setManage] = useState(false);

  const [name, setName] = useState(cmd.name);
  const [description, setDescription] = useState(cmd.description);

  const queryClient = useQueryClient();
  const updateMutation = useCustomCommandUpdateMutation();

  function save() {
    if (name.length == 0 || description.length == 0) return;

    updateMutation.mutate(
      {
        guildId: guildId!,
        commandId: cmd.id,
        req: {
          name,
          description,
          enabled: true,
          parameters: null,
          actions: null,
        },
      },
      {
        onSuccess(res) {
          if (res.success) {
            setManage(false);
            queryClient.invalidateQueries(["custom-bot", guildId, "commands"]);
          } else {
            createToast({
              title: "Failed to update command",
              message: res.error.message,
              type: "error",
            });
          }
        },
      }
    );
  }

  const deleteMutation = useCustomCommandDeleteMutation();

  function deleteCommand() {
    deleteMutation.mutate(
      {
        commandId: cmd.id,
        guildId: guildId!,
      },
      {
        onSuccess: (resp) => {
          if (resp.success) {
            queryClient.invalidateQueries(["custom-bot", guildId, "commands"]);
          } else {
            createToast({
              title: "Failed to delete command",
              message: resp.error.message,
              type: "error",
            });
          }
        },
      }
    );
  }

  return (
    <AutoAnimate className="bg-dark-3 rounded truncate">
      {manage ? (
        <div className="px-5 py-4" key="1">
          <div className="flex justify-between items-start">
            <div className="flex items-center space-x-2 truncate text-lg mb-5 truncate">
              <div className="text-white truncate">
                <span className="font-bold text-gray-500 text-xl">/</span>{" "}
                {cmd.name}
              </div>
            </div>
            <div
              className="flex items-center text-white cursor-pointer bg-blurple hover:bg-blurple-dark rounded px-2 py-1"
              role="button"
              onClick={save}
            >
              <Tooltip text="Delete Command">
                <ClipboardIcon className="h-5 w-5" />
              </Tooltip>
              <div className="ml-2">
                Save <span className="hidden md:inline-block">Changes</span>
              </div>
            </div>
          </div>
          <div className="space-y-5">
            <div>
              <div className="mb-1.5 flex">
                <div className="uppercase text-gray-300 text-sm font-medium">
                  Name
                </div>
                <div className="text-sm italic font-light text-gray-400 ml-2">
                  {name.length} / 32
                </div>
              </div>
              <input
                type="text"
                className="bg-dark-2 px-3 py-2 rounded text-white ring-0 border-transparent focus:outline-none w-full max-w-sm"
                minLength={1}
                maxLength={32}
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div>
              <div className="mb-1.5 flex">
                <div className="uppercase text-gray-300 text-sm font-medium">
                  Description
                </div>
                <div className="text-sm italic font-light text-gray-400 ml-2">
                  {description.length} / 100
                </div>
              </div>
              <input
                type="text"
                className="bg-dark-2 px-3 py-2 rounded w-full text-white ring-0 border-transparent focus:outline-none"
                minLength={1}
                maxLength={100}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
          </div>
        </div>
      ) : (
        <div className="flex justify-between items-start py-4 px-5" key="2">
          <div className="flex-auto truncate">
            <div className="flex items-center space-x-2 truncate text-lg mb-1 truncate">
              <div className="text-white truncate">
                <span className="font-bold text-gray-500 text-xl">/</span>{" "}
                {cmd.name}
              </div>
            </div>
            <div className="text-gray-400 text-sm font-light">
              {cmd.description}
            </div>
          </div>
          <div className="flex flex-none items-center space-x-4 md:space-x-3">
            <div
              className="flex items-center text-gray-300 hover:text-white cursor-pointer md:bg-dark-2 md:rounded md:px-2 md:py-1"
              role="button"
              onClick={deleteCommand}
            >
              <Tooltip text="Delete Command">
                <TrashIcon className="h-5 w-5" />
              </Tooltip>
              <div className="hidden md:block ml-2">Delete</div>
            </div>
            {manage ? (
              <div
                className="flex items-center text-gray-300 hover:text-white cursor-pointer md:bg-dark-2 md:rounded md:px-2 md:py-1"
                role="button"
                onClick={() => setManage(false)}
              >
                <Tooltip text="Manage Command">
                  <PencilSquareIcon className="h-5 w-5" />
                </Tooltip>
                <div className="hidden md:block ml-2">Save</div>
              </div>
            ) : (
              <div
                className="flex items-center text-gray-300 hover:text-white cursor-pointer md:bg-dark-2 md:rounded md:px-2 md:py-1"
                role="button"
                onClick={() => setManage(true)}
              >
                <Tooltip text="Manage Command">
                  <PencilSquareIcon className="h-5 w-5" />
                </Tooltip>
                <div className="hidden md:block ml-2">Manage</div>
              </div>
            )}
          </div>
        </div>
      )}
    </AutoAnimate>
  );
}

function formatUpdatedAt(updatedAt: string): string {
  return parseISO(updatedAt).toLocaleString();
}