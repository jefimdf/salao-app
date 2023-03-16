export default function handleOrdenar(dados, col, direcao){
    const data = dados.sort(function (a, b) {            
        if (direcao === 'desc'){
            if (a[col] > b[col]) {
                return -1;
            }    
        }else{
            if (a[col] < b[col]) {
                return -1;
            }            
        }            
    });
    
    return data;
}