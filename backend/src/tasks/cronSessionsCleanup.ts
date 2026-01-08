import cron from 'node-cron';
import prisma from '@configs/db';
import LogsUtils from '@utils/logs';
import type { ErrorCustomVS } from '@schemas/shared/error';

const sessionsCleanup = cron.schedule('0 * * * *', async () => {
  const start = new Date().toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' });
  let task = '';
  let end = '';
  let taskError = '';
  try{
    const deleted = await prisma.sessions.deleteMany({
      where: {
        expires_in: {
          lt: new Date()
        }
      }
    });
    const message = `Sessões expiradas removidos: ${deleted.count}`;
    task = message;
    console.log(message);
  }
  catch(err){
    const error = err as ErrorCustomVS;
    taskError = 'Erro ao remover sessões expiradas: ' + error.message;
    console.error('Erro ao remover sessões expiradas:', error);
  }
  finally{
    end = new Date().toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' });
    LogsUtils.logCronTasks(start, end, task, taskError);
  }
}, {
  timezone: 'America/Sao_Paulo'
});

export default sessionsCleanup;