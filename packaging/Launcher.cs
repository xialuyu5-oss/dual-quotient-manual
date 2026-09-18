using System;
using System.Diagnostics;
using System.Drawing;
using System.IO;
using System.Net;
using System.Reflection;
using System.Text;
using System.Threading;
using System.Windows.Forms;

[assembly: AssemblyTitle("双商训练手册")]
[assembly: AssemblyVersion("0.1.1.0")]
[assembly: AssemblyFileVersion("0.1.1.0")]

internal static class Launcher
{
    private const string Address = "http://127.0.0.1:43119/";
    private const string MutexName = @"Local\DualQuotientManual.Portable.v1";
    private const string StopName = @"Local\DualQuotientManual.Portable.Stop.v1";
    private static readonly string Root = AppDomain.CurrentDomain.BaseDirectory;
    private static readonly StringBuilder Output = new StringBuilder();
    private static Process child;

    [STAThread]
    private static int Main(string[] args)
    {
        bool headless = Array.IndexOf(args, "--headless") >= 0;
        if (Array.IndexOf(args, "--stop") >= 0)
        {
            try { using (EventWaitHandle e = EventWaitHandle.OpenExisting(StopName)) e.Set(); return 0; }
            catch (WaitHandleCannotBeOpenedException) { return 2; }
        }
        bool created;
        using (Mutex mutex = new Mutex(true, MutexName, out created))
        {
            if (!created)
            {
                if (!headless && IsReady()) OpenBrowser();
                return 3;
            }
            try
            {
                using (EventWaitHandle stop = new EventWaitHandle(false, EventResetMode.AutoReset, StopName))
                {
                    StartServer();
                    if (headless)
                    {
                        while (!stop.WaitOne(250))
                            if (child.HasExited) throw new IOException("本地服务意外退出。\n" + GetOutput());
                    }
                    else
                    {
                        Application.EnableVisualStyles();
                        Application.SetCompatibleTextRenderingDefault(false);
                        using (Form form = CreateWindow(stop)) Application.Run(form);
                    }
                }
                return 0;
            }
            catch (Exception error)
            {
                string message = error.Message;
                if (message.Contains("EADDRINUSE"))
                    message = "启动失败：本地端口 43119 已被占用。\n请先关闭已运行的手册启动窗口；如仍失败，请检查占用该端口的程序。";
                WriteError(message);
                if (!headless) MessageBox.Show(message, "双商训练手册", MessageBoxButtons.OK, MessageBoxIcon.Warning);
                return 1;
            }
            finally
            {
                if (child != null)
                {
                    try { if (!child.HasExited) { child.Kill(); child.WaitForExit(5000); } }
                    catch (InvalidOperationException) { }
                    finally { child.Dispose(); }
                }
                mutex.ReleaseMutex();
            }
        }
    }

    private static void StartServer()
    {
        string node = Path.Combine(Root, "runtime", "node.exe");
        string script = Path.Combine(Root, "app", "server.cjs");
        if (!File.Exists(node) || !File.Exists(script) || !File.Exists(Path.Combine(Root, "app", "site", "index.html")))
            throw new IOException("文件不完整。请先把整个 ZIP 解压到一个文件夹，再双击启动；不要只复制这个 EXE。");
        ProcessStartInfo info = new ProcessStartInfo(node);
        info.Arguments = "\"" + script + "\" --parent-pid " + Process.GetCurrentProcess().Id;
        info.WorkingDirectory = Root;
        info.UseShellExecute = false;
        info.CreateNoWindow = true;
        info.RedirectStandardOutput = true;
        info.RedirectStandardError = true;
        info.StandardOutputEncoding = Encoding.UTF8;
        info.StandardErrorEncoding = Encoding.UTF8;
        info.EnvironmentVariables.Remove("NODE_OPTIONS");
        info.EnvironmentVariables.Remove("NODE_PATH");
        child = new Process();
        child.StartInfo = info;
        child.OutputDataReceived += CaptureOutput;
        child.ErrorDataReceived += CaptureOutput;
        child.Start();
        child.BeginOutputReadLine();
        child.BeginErrorReadLine();
        DateTime deadline = DateTime.UtcNow.AddSeconds(20);
        while (DateTime.UtcNow < deadline)
        {
            if (child.HasExited) { child.WaitForExit(); throw new IOException("本地服务未能启动。\n" + GetOutput()); }
            if (IsReady()) return;
            Thread.Sleep(100);
        }
        throw new IOException("启动超时，请完整解压后重试。\n" + GetOutput());
    }

    private static bool IsReady()
    {
        try
        {
            HttpWebRequest request = (HttpWebRequest)WebRequest.Create(Address + "__dq_health");
            request.Proxy = null;
            request.Timeout = 500;
            request.ReadWriteTimeout = 500;
            using (HttpWebResponse response = (HttpWebResponse)request.GetResponse())
                return response.StatusCode == HttpStatusCode.OK &&
                    response.Headers["X-Dual-Quotient-Manual"] == "dual-quotient-manual-portable-v1";
        }
        catch (WebException) { return false; }
    }

    private static Form CreateWindow(EventWaitHandle stop)
    {
        Form form = new Form();
        form.Text = "双商训练手册 · 免安装版";
        form.ClientSize = new Size(490, 245);
        form.StartPosition = FormStartPosition.CenterScreen;
        form.FormBorderStyle = FormBorderStyle.FixedDialog;
        form.MaximizeBox = false;
        form.BackColor = Color.FromArgb(247, 243, 234);
        form.Font = new Font("Microsoft YaHei UI", 10F);

        Label title = new Label();
        title.Text = "双商训练手册";
        title.Font = new Font("Microsoft YaHei UI", 20F, FontStyle.Bold);
        title.SetBounds(28, 24, 430, 48);
        form.Controls.Add(title);
        Label status = new Label();
        status.Text = "已启动，手册会在浏览器中打开。\n使用期间请保留此窗口，关闭窗口即可退出。";
        status.SetBounds(30, 80, 435, 56);
        form.Controls.Add(status);

        Button open = new Button();
        open.Text = "打开手册";
        open.SetBounds(30, 148, 150, 38);
        open.BackColor = Color.FromArgb(168, 47, 35);
        open.ForeColor = Color.White;
        open.FlatStyle = FlatStyle.Flat;
        open.Click += delegate { OpenBrowser(); };
        form.Controls.Add(open);
        Button exit = new Button();
        exit.Text = "退出";
        exit.SetBounds(196, 148, 100, 38);
        exit.Click += delegate { form.Close(); };
        form.Controls.Add(exit);
        Label footer = new Label();
        footer.Text = "v0.1.1  ·  自测与打卡记录保存在当前浏览器";
        footer.ForeColor = Color.DimGray;
        footer.SetBounds(30, 206, 445, 26);
        form.Controls.Add(footer);

        System.Windows.Forms.Timer timer = new System.Windows.Forms.Timer();
        timer.Interval = 400;
        timer.Tick += delegate {
            if (stop.WaitOne(0)) form.Close();
            else if (child.HasExited) {
                timer.Stop();
                MessageBox.Show("本地服务已停止，请重新启动手册。", "双商训练手册");
                form.Close();
            }
        };
        form.Shown += delegate { timer.Start(); OpenBrowser(); };
        form.FormClosed += delegate { timer.Stop(); timer.Dispose(); };
        return form;
    }

    private static void OpenBrowser()
    {
        try { Process.Start(new ProcessStartInfo(Address) { UseShellExecute = true }); }
        catch (Exception) { MessageBox.Show("请在浏览器中打开：\n" + Address, "双商训练手册"); }
    }
    private static void CaptureOutput(object sender, DataReceivedEventArgs e)
    {
        if (e.Data == null) return;
        lock (Output) { Output.AppendLine(e.Data); if (Output.Length > 16000) Output.Remove(0, 8000); }
    }
    private static string GetOutput() { lock (Output) { return Output.ToString(); } }
    private static void WriteError(string message)
    {
        try {
            string folder = Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.LocalApplicationData), "DualQuotientManual");
            Directory.CreateDirectory(folder);
            File.WriteAllText(Path.Combine(folder, "launcher-error.log"), DateTime.Now.ToString("s") + "\n" + message, Encoding.UTF8);
        } catch (IOException) { } catch (UnauthorizedAccessException) { }
    }
}
