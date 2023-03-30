export default function removeMascara(valor) {
    return valor.replace('(','').replace(')', '').replace('-', '').replace(' ', '');
}