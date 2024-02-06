import { Fragment, useState } from "react";
import { Dialog, Disclosure, Menu, Transition } from "@headlessui/react";
import {
  BellIcon,
  BookOpenIcon,
  ClipboardListIcon,
  DocumentReportIcon,
  HomeIcon,
  LockOpenIcon,
  MenuAlt2Icon,
  ViewListIcon,
  XIcon,
} from "@heroicons/react/solid";
import { useAuth } from "../contexts/auth";
import Cookies from "js-cookie";
import Link from "next/link";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function Layout({ children, state }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { logout } = useAuth();
  const role = Cookies.get("role");

  var navigation;

  navigation = [
    { name: "Хянах самбар", href: "/", icon: HomeIcon },
    { name: "Миний ажлууд", href: "/", icon: ClipboardListIcon },
    { name: "Бүх ажлууд", href: "/", icon: ViewListIcon },
  ];

  const handleLogout = (e) => {
    e.preventDefault();
    logout();
  };

  return (
    <>
      <div>
        <Transition.Root show={sidebarOpen} as={Fragment}>
          <Dialog
            as="div"
            className="relative z-40 md:hidden"
            onClose={setSidebarOpen}
          >
            <Transition.Child
              as={Fragment}
              enter="transition-opacity ease-linear duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="transition-opacity ease-linear duration-300"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div className="fixed inset-0 bg-gray-600 bg-opacity-75" />
            </Transition.Child>

            <div className="fixed inset-0 flex z-40">
              <Transition.Child
                as={Fragment}
                enter="transition ease-in-out duration-300 transform"
                enterFrom="-translate-x-full"
                enterTo="translate-x-0"
                leave="transition ease-in-out duration-300 transform"
                leaveFrom="translate-x-0"
                leaveTo="-translate-x-full"
              >
                <Dialog.Panel className="relative flex-1 flex flex-col max-w-xs w-full pt-5 pb-4 bg-indigo-700">
                  <Transition.Child
                    as={Fragment}
                    enter="ease-in-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in-out duration-300"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                  >
                    <div className="absolute top-0 right-0 -mr-12 pt-2">
                      <button
                        type="button"
                        className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                        onClick={() => setSidebarOpen(false)}
                      >
                        <span className="sr-only">Close sidebar</span>
                        <XIcon
                          className="h-6 w-6 text-white"
                          aria-hidden="true"
                        />
                      </button>
                    </div>
                  </Transition.Child>
                  <div className="flex-shrink-0 flex items-center px-4">
                    <div className="flex align-start">
                      <h1 className="text-lg text-white font-medium">
                        AlphaHub
                      </h1>
                      <p className="text-gray-300 text-xs">
                        &nbsp;{global.version}
                      </p>
                    </div>
                  </div>
                  <div className="mt-5 flex-1 h-0 overflow-y-auto">
                    <nav className="px-2 space-y-1">
                      {navigation.map((item, index) =>
                        !item.children ? (
                          <Link key={item.name} href={item.href}>
                            <a
                              key={item.name}
                              href={item.href}
                              className={classNames(
                                index === state
                                  ? "bg-indigo-800 text-white"
                                  : "text-indigo-100 hover:bg-indigo-600",
                                "group flex items-center px-2 py-2 text-base font-medium rounded-md"
                              )}
                            >
                              <item.icon
                                className="mr-4 flex-shrink-0 h-6 w-6 text-indigo-300"
                                aria-hidden="true"
                              />
                              {item.name}
                            </a>
                          </Link>
                        ) : (
                          <Disclosure
                            as="div"
                            key={item.name}
                            className="space-y-1"
                          >
                            {({ open }) => (
                              <>
                                <Disclosure.Button
                                  className={classNames(
                                    index === state
                                      ? "bg-indigo-800 text-white"
                                      : "text-indigo-100 hover:bg-indigo-600",
                                    "group w-full flex items-center pl-2 pr-1 py-2 text-left text-base font-medium rounded-md"
                                  )}
                                >
                                  <item.icon
                                    className="text-indigo-300 mr-4 flex-shrink-0 h-6 w-6"
                                    aria-hidden="true"
                                  />
                                  <span className="flex-1">{item.name}</span>
                                  <svg
                                    className={classNames(
                                      open
                                        ? "text-white rotate-90"
                                        : "text-gray-300",
                                      "ml-3 flex-shrink-0 h-5 w-5 transform transition-colors ease-in-out duration-150"
                                    )}
                                    viewBox="0 0 20 20"
                                    aria-hidden="true"
                                  >
                                    <path
                                      d="M6 6L14 10L6 14V6Z"
                                      fill="currentColor"
                                    />
                                  </svg>
                                </Disclosure.Button>
                                <Disclosure.Panel className="space-y-1">
                                  {item.children.map((subItem) => (
                                    <Disclosure.Button
                                      key={subItem.name}
                                      as="a"
                                      href={subItem.href}
                                      className="group w-full flex items-center pl-14 pr-2 py-2 text-sm font-medium text-gray-300 rounded-md hover:text-white hover:bg-indigo-600"
                                    >
                                      {subItem.name}
                                    </Disclosure.Button>
                                  ))}
                                </Disclosure.Panel>
                              </>
                            )}
                          </Disclosure>
                        )
                      )}
                    </nav>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
              <div className="flex-shrink-0 w-14" aria-hidden="true">
                {/* Dummy element to force sidebar to shrink to fit close icon */}
              </div>
            </div>
          </Dialog>
        </Transition.Root>

        {/* Static sidebar for desktop */}
        <div className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0">
          {/* Sidebar component, swap this element with another sidebar if you like */}
          <div className="flex flex-col flex-grow pt-5 bg-indigo-700 overflow-y-auto">
            <div className="flex items-center flex-shrink-0 px-4">
              <div className="flex align-start">
                <h1 className="text-lg text-white font-medium">AlphaHub</h1>
                <p className="text-gray-300 text-xs">&nbsp;{global.version}</p>
              </div>
            </div>
            <div className="mt-5 flex-1 flex flex-col">
              <nav className="flex-1 px-2 pb-4 space-y-1">
                {navigation.map((item, index) =>
                  !item.children ? (
                    <Link key={item.name} href={item.href}>
                      <a
                        key={item.name}
                        href={item.href}
                        className={classNames(
                          index === state
                            ? "bg-indigo-800 text-white"
                            : "text-indigo-100 hover:bg-indigo-600",
                          "group flex items-center px-2 py-2 text-base font-medium rounded-md"
                        )}
                      >
                        <item.icon
                          className="mr-4 flex-shrink-0 h-6 w-6 text-indigo-300"
                          aria-hidden="true"
                        />
                        {item.name}
                      </a>
                    </Link>
                  ) : (
                    <Disclosure
                      as="div"
                      key={item.name}
                      className="space-y-1"
                      defaultOpen={true}
                    >
                      {({ open }) => (
                        <>
                          <Disclosure.Button
                            className={classNames(
                              index === state
                                ? "bg-indigo-800 text-white"
                                : "text-indigo-100 hover:bg-indigo-600",
                              "group w-full flex items-center pl-2 pr-1 py-2 text-left text-base font-medium rounded-md"
                            )}
                          >
                            <item.icon
                              className="text-indigo-300 mr-4 flex-shrink-0 h-6 w-6"
                              aria-hidden="true"
                            />
                            <span className="flex-1">{item.name}</span>
                            <svg
                              className={classNames(
                                open ? "text-white rotate-90" : "text-gray-300",
                                "ml-3 flex-shrink-0 h-5 w-5 transform transition-colors ease-in-out duration-150"
                              )}
                              viewBox="0 0 20 20"
                              aria-hidden="true"
                            >
                              <path
                                d="M6 6L14 10L6 14V6Z"
                                fill="currentColor"
                              />
                            </svg>
                          </Disclosure.Button>
                          <Disclosure.Panel className="space-y-1">
                            {item.children.map((subItem) => (
                              <Disclosure.Button
                                key={subItem.name}
                                as="a"
                                href={subItem.href}
                                className="group w-full flex items-center pl-14 pr-2 py-2 text-sm font-medium text-gray-300 rounded-md hover:text-white hover:bg-indigo-600"
                              >
                                {subItem.name}
                              </Disclosure.Button>
                            ))}
                          </Disclosure.Panel>
                        </>
                      )}
                    </Disclosure>
                  )
                )}
              </nav>
            </div>
          </div>
        </div>
        <div className="md:pl-64 flex flex-col flex-1">
          <div className="sticky top-0 z-10 flex-shrink-0 flex h-16 bg-white shadow">
            <button
              type="button"
              className="px-4 border-r border-gray-200 text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500 md:hidden"
              onClick={() => setSidebarOpen(true)}
            >
              <span className="sr-only">Open sidebar</span>
              <MenuAlt2Icon className="h-6 w-6" aria-hidden="true" />
            </button>
            <div className="flex-1 px-4 flex justify-end">
              {role === "21232f297a57a5a743894a0e4a801fc3" && (
                <div className="ml-4 mt-6 flex gap-2">
                  <LockOpenIcon className="w-5 h-5 text-green-500" />
                  <p className="text-black font-medium text-sm">Админ</p>
                </div>
              )}
              <div className="ml-4 flex items-center md:ml-6">
                <button
                  type="button"
                  className="bg-white p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  <span className="sr-only">View notifications</span>
                  <BellIcon className="h-6 w-6" aria-hidden="true" />
                </button>

                {/* Profile dropdown */}
                <Menu as="div" className="ml-3 relative">
                  <div>
                    <Menu.Button className="max-w-xs bg-white flex items-center text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                      <span className="sr-only">Open user menu</span>
                      <span className="inline-block h-8 w-8 rounded-full overflow-hidden bg-gray-100">
                        <svg
                          className="h-full w-full text-gray-300"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
                        </svg>
                      </span>
                    </Menu.Button>
                  </div>
                  <Transition
                    as={Fragment}
                    enter="transition ease-out duration-100"
                    enterFrom="transform opacity-0 scale-95"
                    enterTo="transform opacity-100 scale-100"
                    leave="transition ease-in duration-75"
                    leaveFrom="transform opacity-100 scale-100"
                    leaveTo="transform opacity-0 scale-95"
                  >
                    <Menu.Items className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
                      <Menu.Item key="Гарах">
                        {({ active }) => (
                          <button
                            onClick={handleLogout}
                            className={classNames(
                              active ? "bg-gray-100" : "",
                              "block px-4 py-2 text-sm text-gray-700 w-full text-left"
                            )}
                          >
                            Гарах
                          </button>
                        )}
                      </Menu.Item>
                    </Menu.Items>
                  </Transition>
                </Menu>
              </div>
            </div>
          </div>

          <main>
            <div className="py-6">
              <div className="max-w-full mx-auto px-4 sm:px-6 md:px-8">
                {children}
              </div>
            </div>
          </main>
        </div>
      </div>
    </>
  );
}
