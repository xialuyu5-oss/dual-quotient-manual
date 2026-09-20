using System;
using System.Diagnostics;
using System.Drawing;
using System.IO;
using System.Globalization;
using System.Net;
using System.Reflection;
using System.Text;
using System.Threading;
using System.Windows.Forms;

[assembly: AssemblyTitle("双商训练手册")]
[assembly: AssemblyVersion("0.4.0.0")]
[assembly: AssemblyFileVersion("0.4.0.0")]

internal static class Launcher
{
    private const string Address = "http://127.0.0.1:43119/";
    private const string MutexName = @"Local\DualQuotientManual.Portable.v1";
    private const string StopName = @"Local\DualQuotientManual.Portable.Stop.v1";
    private static readonly string Root = AppDomain.CurrentDomain.BaseDirectory;
    private static readonly StringBuilder Output = new StringBuilder();
    private static Process child;
    private static readonly string Locale = DetectLocale();
    private static string BrowserAddress { get { return Address + Locale + "/"; } }
    private static string DetectLocale()
    {
        string name = CultureInfo.CurrentUICulture.Name;
        if (name.StartsWith("zh", StringComparison.OrdinalIgnoreCase))
            return name.IndexOf("TW", StringComparison.OrdinalIgnoreCase) >= 0 || name.IndexOf("HK", StringComparison.OrdinalIgnoreCase) >= 0 || name.IndexOf("Hant", StringComparison.OrdinalIgnoreCase) >= 0 ? "zh-TW" : "zh-CN";
        foreach (string code in new string[] { "ja", "ko", "de", "ru", "es", "fr" })
            if (name.StartsWith(code, StringComparison.OrdinalIgnoreCase)) return code;
        return "en";
    }
    private static string T(int index)
    {
        string[] words;
        switch (Locale)
        {
            case "zh-CN": words = new string[] { "双商训练手册", "免安装版", "已启动，手册会在浏览器中打开。\n使用期间请保留此窗口，关闭窗口即可退出。", "打开手册", "退出", "自测与打卡记录保存在当前浏览器", "文件不完整。请完整解压 ZIP；不要只复制 EXE。", "本地服务未能启动。", "启动超时，请完整解压后重试。", "本地服务已停止，请重新启动手册。", "本地端口 43119 已被占用。请关闭已运行的手册启动窗口，或检查占用端口的程序。", "请在浏览器中打开：" }; break;
            case "zh-TW": words = new string[] { "雙商訓練手冊", "免安裝版", "已啟動，手冊會在瀏覽器中開啟。\n使用期間請保留此視窗，關閉視窗即可結束。", "開啟手冊", "結束", "自測與打卡記錄保存在目前瀏覽器", "檔案不完整。請完整解壓縮 ZIP；不要只複製 EXE。", "本機服務無法啟動。", "啟動逾時，請完整解壓縮後重試。", "本機服務已停止，請重新啟動手冊。", "本機連接埠 43119 已被占用。請關閉已開啟的手冊視窗，或檢查占用程式。", "請在瀏覽器中開啟：" }; break;
            case "ja": words = new string[] { "思考と感情のトレーニング手帳", "ポータブル版", "起動しました。ブラウザーで手帳が開きます。\n使用中はこのウィンドウを開いたままにしてください。閉じると終了します。", "手帳を開く", "終了", "自己点検と実践の記録は現在のブラウザーに保存されます", "ファイルが不足しています。ZIP 全体を展開してください。EXE だけをコピーしないでください。", "ローカルサービスを起動できませんでした。", "起動がタイムアウトしました。完全に展開してから再試行してください。", "ローカルサービスが停止しました。再起動してください。", "ポート 43119 が使用中です。起動済みの手帳を閉じるか、使用中のプログラムを確認してください。", "ブラウザーで開いてください：" }; break;
            case "ko": words = new string[] { "사고와 감정 훈련 안내서", "포터블 버전", "시작되었습니다. 브라우저에서 안내서가 열립니다.\n사용 중에는 이 창을 열어 두세요. 닫으면 종료됩니다.", "안내서 열기", "종료", "자기 점검과 실천 기록은 현재 브라우저에 저장됩니다", "파일이 부족합니다. EXE만 복사하지 말고 ZIP 전체를 압축 해제하세요.", "로컬 서비스를 시작하지 못했습니다.", "시작 시간이 초과되었습니다. 전체 압축을 해제한 뒤 다시 시도하세요.", "로컬 서비스가 중지되었습니다. 다시 시작하세요.", "포트 43119가 사용 중입니다. 이미 실행 중인 안내서를 닫거나 해당 포트를 사용하는 프로그램을 확인하세요.", "브라우저에서 열어 주세요: " }; break;
            case "de": words = new string[] { "Handbuch für Denken und Gefühle", "Portable Ausgabe", "Gestartet. Das Handbuch öffnet sich im Browser.\nLassen Sie dieses Fenster geöffnet. Schließen beendet die Anwendung.", "Handbuch öffnen", "Beenden", "Selbsteinschätzung und Übungen bleiben in diesem Browser", "Dateien fehlen. Entpacken Sie das ganze ZIP, nicht nur die EXE.", "Der lokale Dienst konnte nicht starten.", "Zeitüberschreitung. Vollständig entpacken und erneut versuchen.", "Der lokale Dienst wurde beendet. Bitte neu starten.", "Port 43119 ist belegt. Schließen Sie ein bereits gestartetes Handbuch oder prüfen Sie das Programm am Port.", "Im Browser öffnen:" }; break;
            case "ru": words = new string[] { "Руководство по мышлению и эмоциям", "Портативная версия", "Запущено. Руководство откроется в браузере.\nОставьте это окно открытым. Закрытие завершает работу.", "Открыть", "Выйти", "Самооценки и отметки сохраняются в текущем браузере", "Не хватает файлов. Распакуйте весь ZIP, а не только EXE.", "Не удалось запустить локальную службу.", "Время запуска истекло. Полностью распакуйте архив и повторите.", "Локальная служба остановлена. Запустите снова.", "Порт 43119 занят. Закройте уже запущенное руководство или проверьте использующую порт программу.", "Откройте в браузере:" }; break;
            case "es": words = new string[] { "Manual de pensamiento y emociones", "Versión portable", "Iniciado. El manual se abrirá en el navegador.\nMantén esta ventana abierta. Cerrar detiene la aplicación.", "Abrir manual", "Salir", "Las autoevaluaciones y prácticas se guardan en este navegador", "Faltan archivos. Extrae todo el ZIP, no solo el EXE.", "No se pudo iniciar el servicio local.", "Se agotó el tiempo de inicio. Extrae todo el archivo e inténtalo de nuevo.", "El servicio local se detuvo. Reinicia el manual.", "El puerto 43119 está ocupado. Cierra otro manual abierto o revisa el programa que usa el puerto.", "Abrir en el navegador:" }; break;
            case "fr": words = new string[] { "Manuel de la pensée et des émotions", "Version portable", "Démarré. Le manuel s’ouvre dans le navigateur.\nGardez cette fenêtre ouverte. La fermer arrête l’application.", "Ouvrir le manuel", "Quitter", "Autoévaluations et exercices restent dans ce navigateur", "Fichiers manquants. Extrayez tout le ZIP, pas seulement l’EXE.", "Le service local n’a pas pu démarrer.", "Délai dépassé. Extrayez complètement l’archive et réessayez.", "Le service local s’est arrêté. Veuillez redémarrer.", "Le port 43119 est occupé. Fermez le manuel déjà lancé ou vérifiez le programme utilisant ce port.", "Ouvrez dans le navigateur :" }; break;
            default: words = new string[] { "Thinking and Emotional Growth Manual", "Portable edition", "Started. The manual opens in your browser.\nKeep this window open while using it. Close it to stop the application.", "Open manual", "Exit", "Assessment and practice records stay in this browser", "Files are missing. Extract the entire ZIP, not just the EXE.", "The local service could not start.", "Startup timed out. Extract the full archive and try again.", "The local service stopped. Please restart the manual.", "Port 43119 is in use. Close an existing manual window or check the program using this port.", "Open in your browser:" }; break;
        }
        return words[index];
    }

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
                            if (child.HasExited) throw new IOException(T(9) + "\n" + GetOutput());
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
                    message = T(10);
                WriteError(message);
                if (!headless) MessageBox.Show(message, T(0), MessageBoxButtons.OK, MessageBoxIcon.Warning);
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
            throw new IOException(T(6));
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
            if (child.HasExited) { child.WaitForExit(); throw new IOException(T(7) + "\n" + GetOutput()); }
            if (IsReady()) return;
            Thread.Sleep(100);
        }
        throw new IOException(T(8) + "\n" + GetOutput());
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
        form.Text = T(0) + " · " + T(1);
        form.ClientSize = new Size(660, 280);
        form.AutoScaleMode = AutoScaleMode.Dpi;
        form.StartPosition = FormStartPosition.CenterScreen;
        form.FormBorderStyle = FormBorderStyle.FixedDialog;
        form.MaximizeBox = false;
        form.BackColor = Color.FromArgb(247, 243, 234);
        form.Font = new Font("Microsoft YaHei UI", 10F);

        Label title = new Label();
        title.Text = T(0);
        title.Font = new Font("Microsoft YaHei UI", 17F, FontStyle.Bold);
        title.SetBounds(28, 24, 604, 48);
        form.Controls.Add(title);
        Label status = new Label();
        status.Text = T(2);
        status.SetBounds(30, 80, 600, 72);
        form.Controls.Add(status);

        Button open = new Button();
        open.Text = T(3);
        open.SetBounds(30, 166, 184, 38);
        open.BackColor = Color.FromArgb(168, 47, 35);
        open.ForeColor = Color.White;
        open.FlatStyle = FlatStyle.Flat;
        open.Click += delegate { OpenBrowser(); };
        form.Controls.Add(open);
        Button exit = new Button();
        exit.Text = T(4);
        exit.SetBounds(232, 166, 126, 38);
        exit.Click += delegate { form.Close(); };
        form.Controls.Add(exit);
        Label footer = new Label();
        footer.Text = "v0.2.0  ·  " + T(5);
        footer.ForeColor = Color.DimGray;
        footer.SetBounds(30, 226, 600, 42);
        form.Controls.Add(footer);

        System.Windows.Forms.Timer timer = new System.Windows.Forms.Timer();
        timer.Interval = 400;
        timer.Tick += delegate {
            if (stop.WaitOne(0)) form.Close();
            else if (child.HasExited) {
                timer.Stop();
                MessageBox.Show(T(9), T(0));
                form.Close();
            }
        };
        form.Shown += delegate { timer.Start(); OpenBrowser(); };
        form.FormClosed += delegate { timer.Stop(); timer.Dispose(); };
        return form;
    }

    private static void OpenBrowser()
    {
        try { Process.Start(new ProcessStartInfo(BrowserAddress) { UseShellExecute = true }); }
        catch (Exception) { MessageBox.Show(T(11) + "\n" + BrowserAddress, T(0)); }
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
