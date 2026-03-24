import {message} from 'antd';

const notificationService = {
    success(content: string, duration: number = 2){
        message.success(content, duration)
    },
    error(content: string, duration: number = 3) {
        message.error(content, duration)
    },
    warming(content: string, duration: number = 2) {
        message.error(content, duration)
    },
    info(content: string, duration: number = 2) {
    message.info(content, duration);
  },
}

export default notificationService;