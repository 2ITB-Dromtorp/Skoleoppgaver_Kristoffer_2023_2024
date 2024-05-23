export function getDescription(Name: string) {
    const descriptions: { [key: string]: string } = {
        'Panini Kylling': 'En deilig panini fylt med saftig kylling, ost og grønnsaker.',
        'Panini Skinke': 'En smakfull panini med skinke, ost og ferske grønnsaker.',
        'Toast Skinke og Ost': 'Sprøstekt toast med skinke og smeltet ost, perfekt til lunsj.',
        'Baguette Ost og Skinke': 'Klassisk baguette med ost og skinke, servert med friske grønnsaker.',
        'Kyllingsalat': 'En frisk salat med kylling, blandede grønnsaker og en deilig dressing.',
        'Coca Cola': 'En forfriskende kullsyreholdig drikk, kjent over hele verden.',
        'Pepsi': 'En populær kullsyreholdig drikk med en unik smak.',
        'Sprite': 'En klar og sprudlende sitron-lime drikk.',
        'Fanta': 'En fruktig og sprudlende appelsindrikk.',
        'Appelsinjuice': 'Ferskpresset appelsinjuice, rik på vitaminer og smak.'
    };
    return descriptions[Name] || 'Ingen beskrivelse tilgjengelig for dette produktet.';
}
