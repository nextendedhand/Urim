import ToDoTip from './ToDoTip';
import settingsData from './settingsData'

/**
 * 詳細ダイアログに表示するコンテンツを生成するクラス
 */
class DetailDialogManager {
    private dialog: HTMLDialogElement;

    /**
     * 詳細ダイアログの取得と、閉じるボタンを押した際にダイアログを閉じるイベント処理を追加する
     */
    constructor() {
        this.dialog = <HTMLDialogElement>document.getElementById('detail-dialog');
        this.dialog.querySelector('#close-detail-dialog-button').addEventListener('click', () => {
            this.dialog.close();
        });
    }

    /**
     * 工数が見やすくなるよう、0を表示しない
     * 
     * @param manHour 工数
     */
    private formatManHour(manHour: { [s: string]: number }) {
        let formattedManHour = ''

        if (manHour.year !== 0) {
            formattedManHour += `${manHour.year}y`
        }
        if (manHour.month !== 0) {
            formattedManHour += `${manHour.month}m`
        }
        if (manHour.day !== 0) {
            formattedManHour += `${manHour.day}d`
        }
        if (manHour.hour !== 0) {
            formattedManHour += `${manHour.hour}h`
        }

        return formattedManHour;
    }

    /**
     * 本日行うtodoかどうかを表す星を描画する
     * 
     * @param toDoTip toDoTipデータ
     */
    private renderStar(toDoTip: ToDoTip) {
        if (toDoTip.toDoData.getIsToday()) {
            this.dialog.querySelector('#detail-today-star').removeAttribute('style');
            let deteilStarElement = <HTMLElement>this.dialog.querySelector('#detail-not-today-star');
            deteilStarElement.style.display = 'none';
        } else {
            this.dialog.querySelector('#detail-not-today-star').removeAttribute('style');
            let deteilStarElement = <HTMLElement>this.dialog.querySelector('#detail-today-star');
            deteilStarElement.style.display = 'none';
        }
    }

    /**
     * 詳細ダイアログ内に表示するコンテンツをDOM操作により変更する
     * 
     * @param toDoTip todoTipデータ
     * @param settingsData settingsデータ
     */
    public renderContents(toDoTip: ToDoTip, settingsData: settingsData) {
        this.dialog.showModal();
        this.renderStar(toDoTip);
        this.dialog.querySelector('#detail-title').textContent = `作業名：${toDoTip.toDoData.getTitle()}`;
        this.dialog.querySelector('#detail-contents').textContent = `作業内容：${toDoTip.toDoData.getDetailData().getContents()}`;
        this.dialog.querySelector('#detail-importance').textContent = `重要度：${toDoTip.toDoData.getImportance()}`;
        this.dialog.querySelector('#detail-urgency').textContent = `緊急度：${toDoTip.toDoData.getUrgency()}`;
        this.dialog.querySelector('#detail-deadline').textContent = `〆切：${toDoTip.toDoData.getDetailData().getDeadLine().year}/${toDoTip.toDoData.getDetailData().getDeadLine().month}/${toDoTip.toDoData.getDetailData().getDeadLine().day}`;
        this.dialog.querySelector('#detail-manHour').textContent = `工数：${this.formatManHour(toDoTip.toDoData.getManHour())}`;
        this.dialog.querySelector('#detail-genre').textContent = `ジャンル：${settingsData.getGenreData()[toDoTip.toDoData.getGenreId()]['name']} `;
        this.dialog.querySelector('#detail-place').textContent = `場所：${toDoTip.toDoData.getDetailData().getPlace()} `;
    }
};

export default DetailDialogManager;
