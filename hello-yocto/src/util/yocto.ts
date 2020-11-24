import os from "os";
import { execFile } from "child_process";
import { app } from "electron";
import { dialog } from "electron";

const vhub_ignore_error = false;

export function startVirtualHub(): void {
  const arch = os.arch();
  const ostype = os.type().toLowerCase();
  let executablePath = "";

  console.log("startVirtualHub called, arch:", arch, "ostype:", ostype);

  if (ostype.startsWith("win")) {
    executablePath = "windows/VirtualHub.exe";
  } else if (ostype === "linux") {
    if (arch === "x64") {
      executablePath = "linux/64bits/VirtualHub";
    } else if (arch === "ia32") {
      executablePath = "linux/32bits/VirtualHub";
    } else if (arch === "arm64") {
      executablePath = "linux/aarch64/VirtualHub";
    } else if (arch === "arm") {
      executablePath = "linux/armhf/VirtualHub";
    }
  } else if (ostype === "darwin") {
    executablePath = "osx/VirtualHub";
  }

  const rel_path = "VirtualHub/" + executablePath;
  console.log("   VirtualHub rel_path:", rel_path);
  console.log("   CWD:    ", process.cwd());
  console.log("   apppath:", app.getAppPath());
  const full_path = process.cwd() + "/" + rel_path;
  console.log("startVirtualHub using full_path:", full_path);

  const vhub_process = execFile(
    full_path,
    ["-y"],
    { cwd: app.getAppPath() },
    function(error, stdout, stderr) {
      if (vhub_ignore_error) {
        return;
      }
      if (stderr) {
        console.log("ERR:" + stderr.toString());
        dialog.showErrorBox("VirtualHub error", stderr.toString());
      } else {
        console.log(stdout.toString());
      }
      if (error) {
        console.error(error);
        dialog.showErrorBox("VirtualHub error", error.toString());
        return;
      }
    }
  );
  console.log("startVirtualHub started process:", !!vhub_process);
}
