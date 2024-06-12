export function getImage(Name: string) {
    const images: { [key: string]: string } = {
        'Fotball': '/Fotball.png',
        'Volleyball': '/Volleyball.png',
        'Håndball': '/Håndball.jpg',
    };
    return images[Name] || '/images/default.png';
}