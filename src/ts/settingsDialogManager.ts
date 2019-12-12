import settingsDataManager from './settingsDataManager'
import genreData from './genreData';

/**
 * 詳細ダイアログに表示するコンテンツを生成するクラス
 */
class SettingsDialogManager {
    private dialog: HTMLDialogElement;
    //private tddm: toDoDataManager;
    private sdm: settingsDataManager;
    private req: boolean;
    private id: string;
    private isPushedCreateBtn : boolean;


    /**
     * 詳細ダイアログの取得と、閉じるボタンを押した際にダイアログを閉じるイベント処理を追加する
     */
    constructor() {
        this.dialog = <HTMLDialogElement>document.getElementById('settings-dialog');
        this.addEvent();
        this.sdm = new settingsDataManager();
        this.req = false;
        this.sdm.import();
        this.id = null;
        this.isPushedCreateBtn = false;
    }

    /**
     * Event Listener
     */
    private addEvent = (): void => {

        // 閉じるボタン
        this.dialog.querySelector('#close-settings-dialog-button').addEventListener('click', () => {
            this.writeDataToElectronStore();

            setTimeout(function(){
                let allGenreData = document.getElementById('genreList');
                while(allGenreData.firstChild){
                    allGenreData.removeChild(allGenreData.firstChild);
                }                
            },300);

            this.dClose();
        });


        this.dialog.querySelector('#genreAdd').addEventListener('click',(e)=>{

            let genreColor: HTMLInputElement =<HTMLInputElement>document.getElementById('newGenreColorPallet');
            let genreLabel: HTMLInputElement =<HTMLInputElement>document.getElementById('newGenreLabel');

            let color = genreColor.value;
            let label = genreLabel.value;

            this.createGenreData(color,label);
            // 初期値に戻す
            genreColor.value = "#e66465";
            genreLabel.value = "";
        },false);

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
     * 詳細ダイアログ内に表示するコンテンツをDOM操作により変更する
     * 
     */
    public renderContents() {
        if (!this.dialog.open)
            this.dialog.showModal();

        let genreArray = this.sdm.settingsData.getGenreData();
        let urgencyScale = this.sdm.settingsData.getUrgencyScale();

        if(genreArray){
            let genreElements = document.getElementsByName( "genre" ) ;

            if (genreArray.length>genreElements.length){
                for(let i = 0; i<genreArray.length; i++){
                    let id = genreArray[i].getId();
                    let color = genreArray[i].getColor();
                    let label = genreArray[i].getName();
                    this.createGenreData(color,label,id);
                }

            }
        }

        if(urgencyScale){
            let opts = document.getElementsByName( "options" );
            let oneOpt = opts[urgencyScale-1] as HTMLInputElement;
            oneOpt.checked = true;
        }
    }

    /**
     * ジャンルデータの追加
     * 
     * @param color ジャンルに登録したい色(#000000)
     * @param label ジャンルの名称
     * @param id ジャンルのID
     */
    private createGenreData = (color:string,label:string, id?: string):void => {
        if (!id){
            var randnum = this.generateId();
        }else{
            var randnum = id;
        }

        // div 要素の作成と属性の指定
        let divElement = document.createElement("div");
        divElement.innerHTML = `<p name="genre" id=${randnum}><input type="color" id=${randnum} value=${color} name=${label}>`
                                +`<label for="colorpallet" id=${randnum}>${label}</label>`
                                +`<button type="button" id="${randnum}_deleteGenre" class="mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect">delete</button>`;
                                +`</p>`
           
        // li 要素の作成
        let newLi = document.createElement("li");
        newLi.appendChild ( divElement );
       
        // リストに追加
        let list = document.getElementById("genreList");
        list.appendChild( newLi );   

        let oneGenre = document.getElementById(randnum+"_deleteGenre");
        oneGenre.addEventListener('click',function(){
            onClickDeleteNode(randnum);
        });
    }

    /**
     * ジャンルID生成関数
     *  
     *
    */
    private generateId = (): string => {
        // characters which is used as id
        let str = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

        // Number of digits
        let len = 10;

        // generate id
        let id = "";
        for (let i = 0; i < len; i++) {
            id += str.charAt(Math.floor(Math.random() * str.length));
        }

        return id;
    }
    /**
     * 設定情報の書き込み
     *
     *
    */
    private writeDataToElectronStore = ():void => {
        console.log("writeDataToElectronStore")

        // ジャンルデータの取得・登録
        let genreElements = document.getElementsByName( "genre" ) ;
        this.sdm.settingsData.deleteAllGenreData();
        console.log(genreElements.length);

        for (let oneGenreElement="", i = genreElements.length; i--;){
            let oneGenreElements = genreElements[i];
            let smlElem = oneGenreElements.childNodes[0] as HTMLInputElement;
            let oneGenre = new genreData(smlElem.value,smlElem.name,smlElem.id);
            this.sdm.settingsData.setGenreData(oneGenre);
        }

        // 緊急度のスケール値取得・登録
        let scaleElements = document.getElementsByName( "options" ) ;

        // 選択状態の値を取得
        for ( var checkedValue="", i=scaleElements.length; i--; ) {
            var element = scaleElements[i] as HTMLInputElement;       
            if ( element.checked ) {
                checkedValue = element.value ;
                break ;
            }
        }

        if ( checkedValue === "" ) {
            // 未選択状態
        } else {
            this.sdm.settingsData.setUrgencyScale(parseInt(checkedValue));
        }

        this.sdm.export();
        this.req = true;
    }
};

function onClickDeleteNode(randnum:string):void{
        let elem = document.getElementById(randnum);
        let elem2 = elem.parentNode.parentNode;
        elem2.parentNode.removeChild(elem2);    
}


export default SettingsDialogManager;
