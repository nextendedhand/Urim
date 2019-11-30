import ToDoTip from './ToDoTip';
import toDoData from './toDoData';
import ToDoDataManager from './toDoDataManager';
import genreData from './genreData';
import settingsDataManager from './settingsDataManager';
import Common from './common';
const sdm = new settingsDataManager();

// アプリ管理画面を表示
const settingBtn = document.getElementById('setting-btn');
settingBtn.addEventListener('click', () => {
    document.getElementById("modal-content").style.display = "block";
    document.getElementById("modal-overlay").style.display = "block";  

    console.log("addEventListener click")
    console.log(sdm.settingsData);
    let genreArray = sdm.settingsData.getGenreData();
    let urgencyScale = sdm.settingsData.getUrgencyScale();

    if(genreArray){
        let genreElements = document.getElementsByName( "genre" ) ;

        if (genreArray.length>genreElements.length){
            for(let i = 0; i<genreArray.length; i++){
                let id = genreArray[i].getId();
                let color = genreArray[i].getColor();
                let label = genreArray[i].getName();
                createGenreData(color,label,id);
            }

        }
    }

    if(urgencyScale){
        let opts = document.getElementsByName( "options" );
        let oneOpt = opts[urgencyScale-1] as HTMLInputElement;
        oneOpt.checked = true;
    }


}, false);

//モーダルウィンドウを閉じる
const modalCloseBtn = document.getElementById('modal-close');
modalCloseBtn.addEventListener('click',()=>{
    document.getElementById("modal-content").style.display = "none";
    document.getElementById("modal-overlay").style.display = "none";

    writeDataToElectronStore();

},false)

const genreAddBtn = document.getElementById('genreAdd');
genreAddBtn.addEventListener('click',()=>{

	const genreColor: HTMLInputElement =<HTMLInputElement>document.getElementById('newGenreColorPallet');
	const genreLabel: HTMLInputElement =<HTMLInputElement>document.getElementById('newGenreLabel');

	const color = genreColor.value;
	const label = genreLabel.value;
	createGenreData(color,label);
},false);

function generateId(): string {
        // characters which is used as id
        var str = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

        // Number of digits
        var len = 10;

        // generate id
        var id = "";
        for (var i = 0; i < len; i++) {
            id += str.charAt(Math.floor(Math.random() * str.length));
        }

        return id;
}

// ジャンルの追加
function createGenreData(color:string,label:string, id?: string):void {
    if (!id){
        console.log("hi")
        var randnum = generateId();
    }else{
        var randnum = id;
    }
    // div 要素の作成と属性の指定
    const divElement = document.createElement("div");
	divElement.innerHTML = '<p name="genre" id='+ randnum +'><input type="color" id='+ randnum +' value='+color+' name='+label+'> <label for="colorpallet" id='+ randnum +'>'+
							label+'</label> <a href="javascript:void(0);" class="button-link" id='+ randnum
                            +' onclick="(function(){let elem = document.getElementById('+ randnum +'); elem2=elem.parentNode.parentNode; elem2.parentNode.removeChild(elem2);})()">削除</a></p>';    

    // li 要素の作成
    var newLi = document.createElement("li");
    newLi.appendChild ( divElement );
   
    // リストに追加
    var list = document.getElementById("genreList");
    list.appendChild( newLi );   
}

function writeDataToElectronStore():void {
    console.log("writeDataToElectronStore")

    // ジャンルデータの取得・登録
    let genreElements = document.getElementsByName( "genre" ) ;

    for (let oneGenreElement="", i = genreElements.length; i--;){
        let oneGenreElements = genreElements[i];
        let smlElem = oneGenreElements.childNodes[0] as HTMLInputElement;
        sdm.settingsData.deleteGenreData(smlElem.id);
        let oneGenre = new genreData(smlElem.value,smlElem.name,smlElem.id);
        sdm.settingsData.setGenreData(oneGenre);
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
        // aには選択状態の値が代入されている
        sdm.settingsData.setUrgencyScale(parseInt(checkedValue));
    }

    sdm.export();
}


//　読み込み時実行
(function(){
    let isLoadedSettingsData = sdm.import();

    // importできなかったとき。初回ロード時？
    if (!isLoadedSettingsData){

    }

    console.log("testsetse");
    console.log(sdm.settingsData);

    let settingsData = sdm.settingsData;

    if (isLoadedSettingsData || settingsData){

    } 



})();

