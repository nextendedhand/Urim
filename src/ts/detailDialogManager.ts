import toDoData from './toDoData';
import toDoDataManager from './toDoDataManager';
import settingsDataManager from './settingsDataManager'
import selectedDataManager from './selectedDataManager';

/**
 * 詳細ダイアログに表示するコンテンツを生成するクラス
 */
class DetailDialogManager {
    private dialog: HTMLDialogElement;
    private tddm: toDoDataManager;
    private sdm: settingsDataManager;
    private req: boolean;
    private id: string;

    /**
     * 詳細ダイアログの取得と、閉じるボタンを押した際にダイアログを閉じるイベント処理を追加する
     */
    constructor() {
        this.dialog = <HTMLDialogElement>document.getElementById('detail-dialog');
        this.addEvent();
        this.sdm = new settingsDataManager();
        this.req = false;
        this.sdm.import();
        this.id = null;
    }

    /**
     * Event Listener
     */
    private addEvent = (): void => {

        // 閉じるボタン
        this.dialog.querySelector('#close-detail-dialog-button').addEventListener('click', () => {
            this.dClose();
        });

        // 設定ボタン
        this.dialog.querySelector('#ddl_edit_btn').addEventListener('click', () => {
            const selectedDataMgr = new selectedDataManager();
            selectedDataMgr.setSelectedId(this.id);
            location.href = '../html/edit_form.html';
            this.dClose();
        });

        // 達成ボタン
        this.dialog.querySelector('#ddl_comp_btn').addEventListener('click', () => {
            this.tddm = new toDoDataManager();
            this.tddm.import();
            this.tddm.delete(this.id);
            this.tddm.export();
            this.req = true;
            this.dClose();
        });

        // 削除ボタン
        this.dialog.querySelector('#ddl_del_btn').addEventListener('click', () => {
            this.tddm = new toDoDataManager();
            this.tddm.import();
            this.tddm.delete(this.id);
            this.tddm.export();
            this.req = true;
            this.dClose();
        });

        // リロード要求：削除などでメインウィンドウの更新が必要な場合への対処
        this.dialog.onclose = () => {
            if (this.req) {
                this.req = false;
                window.location.reload();
            }
        };

    }

    private dClose = (): void => {
        this.id = null;
        this.dialog.close();
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
    private renderStar(toDoData: toDoData) {
        if (toDoData.getIsToday()) {
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
     * @param toDoData todoデータ
     */
    public renderContents(toDoData: toDoData) {
        if (!this.dialog.open)
            this.dialog.showModal();
        this.renderStar(toDoData);
        this.id = toDoData.getId();
        this.dialog.querySelector('#detail-title').textContent = `作業名：${toDoData.getTitle()}`;
        this.dialog.querySelector('#detail-contents').textContent = `作業内容：${toDoData.getDetailData().getContents()}`;
        this.dialog.querySelector('#detail-importance').textContent = `重要度：${toDoData.getImportance()}`;
        this.dialog.querySelector('#detail-urgency').textContent = `残日数：${toDoData.getUrgency()}日`;
        this.dialog.querySelector('#detail-deadline').textContent = `〆切：${toDoData.getDetailData().getDeadLine().year}/${toDoData.getDetailData().getDeadLine().month}/${toDoData.getDetailData().getDeadLine().day}`;
        this.dialog.querySelector('#detail-manHour').textContent = `工数：${this.formatManHour(toDoData.getManHour())}`;
        this.dialog.querySelector('#detail-genre').textContent = `ジャンル：${this.sdm.settingsData.getGenreData().find(gd => gd.getId() === toDoData.getGenreId()).getName()}`;
        this.dialog.querySelector('#detail-place').textContent = `場所：${toDoData.getDetailData().getPlace()} `;
    }
};

export default DetailDialogManager;
