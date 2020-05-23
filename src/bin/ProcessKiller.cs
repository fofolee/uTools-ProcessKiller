// ProcessKiller for uTools
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Drawing;
using System.Linq;
using System.Management;
using System.Runtime.InteropServices;
using System.Text;

namespace ProcessKiller {

    class ProcKiller {

        [DllImport ("shell32.dll")]
        private static extern IntPtr ExtractIcon (IntPtr hInst, string lpFileName, int nIndex);

        // 获取图标
        static string getBase64Icon (string path) {
            string[] pathList = path.Split ('|');
            string output = "[";
            foreach (string p in pathList) {
                Icon AssociatedIcon = SystemIcons.Application;
                // AssociatedIcon = Icon.ExtractAssociatedIcon (p.Trim ());
                string b64Ico;
                try {
                    System.IntPtr hIcon;
                    hIcon = ExtractIcon (IntPtr.Zero, p.Trim (), 0);
                    AssociatedIcon = Icon.FromHandle (hIcon);
                    ImageConverter converter = new ImageConverter ();
                    byte[] data = (byte[]) converter.ConvertTo (AssociatedIcon.ToBitmap (), typeof (byte[]));
                    b64Ico = Convert.ToBase64String (data);
                } catch {
                    b64Ico = "";
                }
                output += string.Format ("{{\"path\": \"{0}\", \"b64Ico\": \"{1}\"}},", p, b64Ico);
            }
            output = output.Substring (0, output.Length - 1);
            output += "]";
            return output.Replace ("\\", "\\\\");
        }

        // 获取进程
        static string getProcessList () {
            // 过滤列表
            string[] filterList = {
                "conhost",
                "svchost",
                "idle",
                "system",
                "rundll32",
                "csrss",
                "lsass",
                "lsm",
                "smss",
                "wininit",
                "winlogon",
                "services",
                "spoolsv",
                "processkiller",
                "memory compression"
            };

            string ProcessList = "[";
            Process[] processes = Process.GetProcesses ();
            foreach (Process p in processes) {
                var name = p.ProcessName.ToLower ();
                if (filterList.Contains (name))
                    continue;
                string path;
                try {
                    path = p.MainModule.FileName.Replace ("\\", "\\\\");
                } catch {
                    path = "程序路径获取失败，需要管理员权限";
                }
                // string description;
                // try {
                //     description = p.MainModule.FileVersionInfo.FileDescription
                // } catch {
                //     description = name;
                // }
                ProcessList += string.Format ("{{\"ProcessName\": \"{0}\", \"Path\": \"{1}\", \"WorkingSet\": {2}, \"Id\": {3}}},", p.ProcessName, path, p.WorkingSet, p.Id);
            }
            ProcessList = ProcessList.Substring (0, ProcessList.Length - 1) + "]";
            return ProcessList;
        }

        public static String getCommandLine (int Id) {
            ManagementObjectSearcher commandLineSearcher = new ManagementObjectSearcher (
                "SELECT CommandLine FROM Win32_Process WHERE ProcessId = " + Id);
            String commandLine = "";
            foreach (ManagementObject commandLineObject in commandLineSearcher.Get ()) {
                commandLine += (String) commandLineObject["CommandLine"];
            }
            return commandLine;
        }

        public static void kill (int Id) {
            Process.GetProcessById (Id).Kill ();
        }

        // 主函数
        static void Main (string[] args) {
            if (args.Length == 1) {
                if (args[0] == "getProcess") {
                    Console.Write (getProcessList ());
                }
            } else if (args.Length == 2) {
                if (args[0] == "getIcons") {
                    string path = args[1];
                    Console.Write (getBase64Icon (path));
                } else if (args[0] == "getCommandLine") {
                    int id = int.Parse (args[1]);
                    Console.Write (getCommandLine (id));
                } else if (args[0] == "kill") {
                    int id = int.Parse (args[1]);
                    kill (id);
                }
            }
        }
    }
}