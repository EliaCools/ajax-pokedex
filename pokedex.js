
let image = document.createElement("img");
let idParagraph = document.createElement("p");
let movesParagraph = document.createElement("p");
let evolvedfromParagraph = document.createElement("p");
let nameParagraph = document.createElement("p");

var currentId = 1
pokedex(currentId);

document.getElementById('run').addEventListener('click', function() {
    pokedex(document.getElementById('input').value);
})
document.getElementById('next').addEventListener('click', function() {
    pokedex(currentId + 1)
})
document.getElementById('prev').addEventListener('click', function() {
    pokedex(currentId - 1)
})

async function pokedex(id) {

    let data = await fetch('https://pokeapi.co/api/v2/pokemon/' + id);
    let pokemon = await data.json();

    currentId = pokemon.id

    image.setAttribute("src", pokemon.sprites.front_default)
    image.setAttribute("id", "sprites")

    document.getElementById("screen").appendChild(image)
    document.getElementById("screen").appendChild(nameParagraph)
    nameParagraph.style.textTransform = "capitalize"
    document.getElementById("screen").appendChild(idParagraph)
    document.getElementById("screen").appendChild(movesParagraph)
    document.getElementById("screen").appendChild(evolvedfromParagraph)

    let newarray = []
    for (let i = 0; i < pokemon.moves.length; i++) {
        if (i <= 4) {
            newarray.push(pokemon.moves[i].move.name)
        }
    }
    nameParagraph.innerText = pokemon.name;
    idParagraph.innerText = "ID: " + pokemon.id
    movesParagraph.innerText = "Moves: " + newarray.join(",  ");


    let speciesurl = await fetch('https://pokeapi.co/api/v2/pokemon-species/' + pokemon.id)
    let speciesdata = await speciesurl.json()


    if (speciesdata.evolves_from_species === null) {
        evolvedfromParagraph.innerText = "No prior evolution"
    } else {
        evolvedfromParagraph.innerText = "Evolved from: " + speciesdata.evolves_from_species.name
    }

    let evolutionchain = await fetch(speciesdata.evolution_chain.url)
    let evolutiondata = await evolutionchain.json();

    document.getElementById('first-pokemon').innerHTML = "";
    document.getElementById('second-pokemon').innerHTML = "";
    document.getElementById('third-pokemon').innerHTML = "";
    if (evolutiondata.chain.evolves_to[0] !== undefined) {


        let lastevolution = await fetch('https://pokeapi.co/api/v2/pokemon-species/' + evolutiondata.chain.evolves_to[0].species.name)
        let lastspecie = await lastevolution.json()

        let firstEvolution = lastspecie.evolves_from_species.name
        var secondEvolution = evolutiondata.chain.evolves_to[0].species.name

        let firstevolutionpicture = await fetch('https://pokeapi.co/api/v2/pokemon/' + firstEvolution);
        let pokemon1 = await firstevolutionpicture.json();

        let secondevolutionpicture = await fetch('https://pokeapi.co/api/v2/pokemon/' + secondEvolution);
        let pokemon2 = await secondevolutionpicture.json();

        let firstevolutionimage = document.createElement('img')
        firstevolutionimage.setAttribute('src', pokemon1.sprites.front_default)
        firstevolutionimage.setAttribute('id', 'first-evolution')

        let secondevolutionimage = document.createElement('img')
        secondevolutionimage.setAttribute('src', pokemon2.sprites.front_default)
        secondevolutionimage.setAttribute('id', 'second-evolution')

        if (evolutiondata.chain.evolves_to[0].evolves_to[0] !== undefined) {
            let thirdEvolution = evolutiondata.chain.evolves_to[0].evolves_to[0].species.name

            let thirdevolutionpicture = await fetch('https://pokeapi.co/api/v2/pokemon/' + thirdEvolution);
            let pokemon3 = await thirdevolutionpicture.json();

            let thirdevolutionimage = document.createElement('img')
            thirdevolutionimage.setAttribute('src', pokemon3.sprites.front_default)
            thirdevolutionimage.setAttribute('id', 'third-evolution')

            document.getElementById('first-pokemon').appendChild(firstevolutionimage)
            document.getElementById('second-pokemon').appendChild(secondevolutionimage)
            document.getElementById('third-pokemon').appendChild(thirdevolutionimage)

        } else if (evolutiondata.chain.evolves_to[0] !== undefined) {
            document.getElementById('first-pokemon').appendChild(firstevolutionimage)
            document.getElementById('second-pokemon').appendChild(secondevolutionimage)
        }
    }
}
