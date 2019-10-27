/**
 * 複数のtsファイルから参照する定数データを格納する
 */
class Common {
    public backgroundColor = ['#ffeaf4', '#fff4ea', '#ffffea', '#eaf4ff'];
    public imToNum: { [s: string]: number } = {
        'S': 0,
        'A': 1,
        'B': 2,
        'C': 3
    };
    public key = {
        toDoData: 'toDoDataArray',
        settingsData: 'settingsData'
    }
}

export default Common;
