import winston, { format } from "winston";
import path from "path";
// ? Singleton
class Logger {

    private static instance: Logger;
    public logger;

    private constructor() {
        this.logger = winston.createLogger({
            level: 'info',
            format: format.combine(
                format.timestamp(),
                format.printf(({ timestamp, level, message }) => {
                    return `${timestamp} [${level}]: ${message}`;
                })
            ),
            defaultMeta: { service: 'user-service' },
            transports: [
              new winston.transports.File({ filename: `${path.join(__dirname, '../../logs/errors.log')}`, level: 'error' }),
              new winston.transports.File({ filename: `${path.join(__dirname, '../../logs/combined.log')}`, level: 'info' }),
            ],
          });
    }

    static getInstance(): Logger {
        if( !this.instance ) this.instance = new Logger();
        return this.instance
    }

}

export default Logger.getInstance().logger;
