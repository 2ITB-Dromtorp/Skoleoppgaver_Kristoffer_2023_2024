export function getImage(Name: string) {
    const images: { [key: string]: string } = {
        'Panini Kylling': '/panini_kylling.jpg',
        'Panini Skinke': '/panini_sinke.png',
        'Toast Skinke og Ost': '/toast.jpg',
        'Baguette Ost og Skinke': '/baguett.jpg',
        'Kyllingsalat': '/kyllingsalat.jpg',
        'Coca Cola': '/cola.jpg',
        'Pepsi': '/pepsi.jpg',
        'Sprite': '/sprite.jpg',
        'Fanta': '/fanta.jpg',
        'Appelsinjuice': '/appelsinjus.jpg',
        'Nudler': '/nudler.jpg',
        'Iste': '/iste.jpg',
        'Kjeks': '/kjeks.jpg',
        'Kylling Vinger': '/kyllingving.jpg',
        'Monster': '/monster.jpg',
        'Oreo Kake': '/oreakake.jpg',
    };
    return images[Name] || '/images/default.png';
}