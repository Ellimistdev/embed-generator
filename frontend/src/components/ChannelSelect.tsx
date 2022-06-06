import { Fragment, useEffect, useMemo } from "react";
import { Listbox, Transition } from "@headlessui/react";
import { CheckIcon, SelectorIcon } from "@heroicons/react/solid";
import useChannels from "../hooks/useChannels";

function classNames(...classes: any) {
  return classes.filter(Boolean).join(" ");
}

interface Props {
  value: string | null;
  onChange: (newValue: string | null) => void;
}

export default function ChannelSelect({ value, onChange }: Props) {
  const channels = useChannels();

  const selectedChannel = useMemo(
    () => channels?.find((c) => c.id === value),
    [value, channels]
  );

  useEffect(() => {
    if (channels && channels.length && !value) {
      onChange(channels[0].id);
    }
  }, [channels, value]);

  return (
    <Listbox value={value} onChange={onChange}>
      {({ open }) => (
        <div className="mt-1 relative">
          <Listbox.Button className="relative w-full bg-dark-2 rounded shadow-sm pl-3 pr-10 py-2 text-left no-ring cursor-pointer">
            {selectedChannel ? (
              <span className="flex items-center">
                <div className="rounded-full flex items-center justify-center text-lg py-0 h-6 text-dark-7">
                  #
                </div>
                <span className="ml-3 block truncate">
                  {selectedChannel.name}
                </span>
              </span>
            ) : (
              <span className="flex items-center">
                <span className="block truncate text-gray-300">
                  Select a channel
                </span>
              </span>
            )}
            <span className="ml-3 absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
              <SelectorIcon
                className="h-5 w-5 text-gray-400"
                aria-hidden="true"
              />
            </span>
          </Listbox.Button>

          <Transition
            show={open}
            as={Fragment}
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Listbox.Options className="absolute z-10 mt-1 w-full bg-dark-2 shadow-lg max-h-56 rounded-md py-1 text-base overflow-auto no-ring sm:text-sm">
              {(channels || []).map((channel) => (
                <Listbox.Option
                  key={channel.id}
                  className={({ active }) =>
                    classNames(
                      active ? "text-white bg-blurple" : "text-gray-300",
                      "cursor-pointer select-none relative py-2 pl-3 pr-9"
                    )
                  }
                  value={channel.id}
                >
                  {({ selected, active }) => (
                    <>
                      <div className="flex items-center">
                        <div className="rounded-full flex items-center justify-center text-lg py-0 h-6 text-dark-7">
                          #
                        </div>
                        <span
                          className={classNames(
                            selected ? "font-semibold" : "font-normal",
                            "ml-3 block truncate"
                          )}
                        >
                          {channel.name}
                        </span>
                      </div>

                      {selected ? (
                        <span
                          className={classNames(
                            active ? "text-white" : "text-blurple",
                            "absolute inset-y-0 right-0 flex items-center pr-4"
                          )}
                        >
                          <CheckIcon className="h-5 w-5" aria-hidden="true" />
                        </span>
                      ) : null}
                    </>
                  )}
                </Listbox.Option>
              ))}
            </Listbox.Options>
          </Transition>
        </div>
      )}
    </Listbox>
  );
}