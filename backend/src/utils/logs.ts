import fs from 'fs';
import path from 'path';
const logDir = path.join(__dirname, '../logs');

if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir, { recursive: true });
}

class LogsUtils {

    static logCronTasks(taskInit: string, taskEnd: string, taskFunc?: string, taskError?: string){
        const log = `[Início: ${taskInit}] ${taskFunc||taskError} [Fim: ${taskEnd}]\n`;
        fs.appendFile(path.join(logDir, 'cron-tasks.log'), log, erro => {
            if (erro) console.error('Erro ao salvar log da cron-task:', erro);
        });
    }

}

export default LogsUtils;