window.onload = () => {
    
    var game = {
        map: MapGame.getMap(),
        context: ContextGame.getContext(),
        settings: {
            jumps: 1, // nossa cobra salta|anda apenas 1 casa
            speed: {
                x: 0, // velocidade no eixo vertical
                y: 0  // velocidade no eixo horizontal
            },
            map:{
                with: MapGame.getMap().width,    // configurações de largura div do canvas destinada ao mapa do jogo
                height: MapGame.getMap().height, // configurações de largura div do canvas destinada ao mapa do jogo
                onePart: 20, //// configuração desejada do mapa 20x20 (20 quadradinhos cima x 20 quadradinhos baixo)
                qtdParts: 20,
                color: 'black'
            },
            snake: {
                position: {
                    x: 10, // posição atual da cobra no eixo vertical
                    y: 10  // posição atual da cobra no eixo horizontal
                },
                trail: [], // rastro da cobra
                tail: 5, // calda da cobra
                color: 'gray'
            },
            coin: {
                position: {
                    x: 15, // posição atual da moeda no eixo vertical
                    y: 15  // posição atual da moeda no eixo horizont
                },
                color: 'yellow',
                setPositionRandom: function () {
                    this.position.x = Math.floor(Math.random() * 20);
                    this.position.y = Math.floor(Math.random() * 20);
                }

            }
        },
        controllers: {
            keyPress: (event) => {
                switch(event.keyCode){
                    case 37: // seta para esquerda
                        game.settings.speed = { 
                            x: -1, 
                            y: 0
                        };
                    break;
                    case 38: // seta para cima
                        game.settings.speed = { 
                            x: 0, 
                            y: -1
                        };
                    break;
                    case 39: // seta para direita
                        game.settings.speed = { 
                            x: 1, 
                            y: 0
                        };
                    break;
                    case 40: // seta para baixo
                        game.settings.speed = { 
                            x: 0, 
                            y: 1
                        };
                    break;
                    default:
                        console.error('Erro game.controllers.keyPress');
                        break;
                }
            }
        }
    };

    document.addEventListener('keydown', (e) => {
        game.controllers.keyPress(e);
    });

    setInterval(() => playGame(game), 100);

};

const playGame = (game) => {
    game.settings.snake.position.x += game.settings.speed.x;
    game.settings.snake.position.y += game.settings.speed.y;

    if(game.settings.snake.position.x < 0){
        game.settings.snake.position.x = game.settings.map.qtdParts-1;
    }

    if(game.settings.snake.position.x > game.settings.map.qtdParts-1){
        game.settings.snake.position.x = 0;
    }

    if(game.settings.snake.position.y < 0){
        game.settings.snake.position.y = game.settings.map.qtdParts-1;
    }

    if(game.settings.snake.position.y > game.settings.map.qtdParts-1){
        game.settings.snake.position.y = 0;
    }


    // configurações iniciais do contexto do game
    game.context.fillStyle = game.settings.map.color;
    game.context.fillRect(0, 0, game.map.width, game.map.height);


    // desenhando a moeda em tela
    game.context.fillStyle = game.settings.coin.color;
    game.context.fillRect(
        game.settings.coin.position.x * game.settings.map.onePart, 
        game.settings.coin.position.y * game.settings.map.onePart, 
        game.settings.map.onePart, 
        game.settings.map.onePart
    );

    // desenhando o restro da cobra
    game.context.fillStyle = game.settings.snake.color;
    
    for(let i = 0; i < game.settings.snake.trail.length; i++){

        game.context.fillRect(
            game.settings.snake.trail[i].x * game.settings.map.onePart, 
            game.settings.snake.trail[i].y * game.settings.map.onePart, 
            game.settings.map.onePart-1, 
            game.settings.map.onePart-1
        );

        // nossa cobra bateu nela mesma
        if(game.settings.snake.trail[i].x == game.settings.snake.position.x && game.settings.snake.trail[i].y == game.settings.snake.position.y){
            game.settings.speed.x = game.settings.speed.y = 0;
            game.settings.snake.tail = 5;
        }
    }
    
    // colocamos a posição x|y que se encontra a cobra no rastro
    game.settings.snake.trail.push({ 
        x: game.settings.snake.position.x, 
        y: game.settings.snake.position.y 
    });

    // removemos ultima posição da calda
    while(game.settings.snake.trail.length > game.settings.snake.tail){
        game.settings.snake.trail.shift();
    }

    // se a cabeça da cobra bateu na moeda, a cauda aumenta
    if(game.settings.snake.position.x == game.settings.coin.position.x && game.settings.snake.position.y == game.settings.coin.position.y){
        game.settings.snake.tail++;
        // gerar uma nova moeda em uma posição aleatória
        game.settings.coin.setPositionRandom();
    }
}

class MapGame {
    static getMap(){
        return document.querySelector('#map-game')
    }
}
class ContextGame {
    static getContext(){
        return MapGame.getMap().getContext('2d')
    }
}
