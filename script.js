//Vamos a usar http://processingjs.org/
  // o https://p5js.org/reference/

  // Importamos las librerias si es necesario usar listas
  const { append, cons, first, isEmpty, isList, length, rest } = functionalLight;
  

  function make(data, attribute) {
    return Object.assign({}, data, attribute);
  }

  //contrato: fondopause  -> function
  //proposito: aplicar "pausa" a la canción de fondo. 
  function fondopause(){
    fondo.pause();
  }
  const SIZE  = 30;  //establece el tamaño de cada espacio (cuadro) en el mapa.
  
  //Establecer el mapa como una matriz 
  //0 será identidicado como vacio
  //1 será identificado como muros horizontal
  //2 será identificado como "comida"
  //3 será identificado como muros vertical
  //4 será identificado como picos
  //5 será identificado como natilla
  //6 será identificada como chimeneas
  let mapa  = [[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
               [3,0,2,0,3,0,0,0,0,0,0,0,0,0,0,0,0,3,0,2,0,3],
               [3,0,6,5,3,0,0,6,2,1,2,0,0,1,2,6,0,3,5,6,0,3],
               [3,0,3,1,3,0,1,1,1,1,1,0,1,1,1,1,0,3,1,3,0,3],
               [3,0,0,0,0,0,0,0,0,0,4,5,4,0,0,0,0,0,0,0,0,3],
               [3,0,1,1,0,4,6,0,1,1,1,1,1,1,0,6,4,0,1,1,0,3], 
               [3,0,3,2,0,1,1,0,2,4,0,0,0,4,0,1,1,0,2,3,0,3],
               [3,0,3,1,0,2,3,0,1,1,0,1,1,1,0,3,2,0,1,3,0,3],
               [3,0,3,2,0,1,3,0,0,2,2,5,2,0,0,3,1,0,2,3,0,3],
               [3,0,3,1,0,2,3,0,1,1,1,1,1,1,0,3,2,0,1,3,0,3],
               [3,0,3,2,0,1,3,0,0,4,2,5,2,0,0,3,1,0,2,3,0,3],
               [3,0,3,1,0,2,3,0,1,1,1,1,1,1,0,3,2,0,1,3,0,3],
               [3,0,3,0,0,1,3,0,0,0,0,0,4,0,0,3,1,0,0,3,0,3],
               [3,0,0,0,0,0,0,0,1,1,1,1,1,1,0,0,0,0,0,0,0,3],
               [3,0,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,0,3],
               [3,0,3,5,3,0,1,1,1,1,1,1,1,1,1,1,0,3,5,3,0,3],
               [3,2,0,0,3,0,0,2,2,2,4,2,2,2,2,0,0,3,0,0,2,3],
               [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]];


      //contrato: listaTotal list -> list
      //prposito: esta funcion crea una lista a partir de una matriz ingresada
    function listaTotal(mapa){
      if(isEmpty(mapa)){
        return [];
      }else{
        return append(first(mapa),listaTotal(rest(mapa)));
      }
    }
    //contrato: cantidadpuntos list -> number
    //proposito: almacena la listaTotal en una constante y retorna la funcion cantidadpuntos1 con la constante creada
    function cantidadpuntos(mapa){        
      const lista_junta = listaTotal(mapa)
      return cantidadpuntos1(lista_junta)
    }
    
    //contrato: cantidadpuntos1 list -> number
    //proposito: determinar cuantos buñuelos("2") tiene el mapa(matriz)
    function cantidadpuntos1(lista_junta){
      if(isEmpty(lista_junta)){
        return 0;
      }else if(first(lista_junta)=='2'){
        return 1 + cantidadpuntos1(rest(lista_junta));
      }else{
        return 0 + cantidadpuntos1(rest(lista_junta));
      }
    }
  
  let cantidadpuntos12 = cantidadpuntos(mapa) //establece una variable para manejar los puntos del juego
  const WIDTH = 660; //ancho del mapa
  const HEIGHT = 540; //alto del mapa
  //Declaración de variables globales para las imagenes del mundo 
  let tombX = 150; 
  let tombY = 480; 
  let tomb = null; 
  let gameover=null;
  let natilla = null
  let muro = null 
  let muro1 = null 
  let muro2 = null //Chimenea
  let picos = null 
  let win = null 
  //Declaración de variables globales para contador de puntos, vidas y configuración de agua.
  let contador = 0; 
  let vidas = 3;
  let y=540; //Agua
  let velocidad=0.3;
  let alto_agua=500;

  //Declaración de variables globales para pausa y muerte
  let pause = false
  let pausatext= false
  let conteomuerte = 13
  let intentar = false 

  //Establecer un sonido para el fondo (con sus respectivas caracteristicas)
  var fondo = new buzz.sound("sounds/fondo2.mp3", {
    preload: true,
    volume: 25,
  });
  //Establecer un sonido de muerte(con sus respectivas caracteristicas)
  var off = new buzz.sound("sounds/off.mp3", {
    volume: 30 
  });
  //establecer un sonido al momento de comer un buñuelo(con sus respectivas caracteristicas)
  var bunuelo = new buzz.sound("sounds/paso1.wav",{
    volume: 30
  }); 

  function sketchProc(processing) {

    /**
     Espacio de trabajo
     **/
    processing.setup = function () {
       //Establecer el frame rate (tiempo de actualizacion del mundo) y el tamaño del área de trabajo.
      processing.frameRate(20);
      processing.size(WIDTH,HEIGHT); 
      //Cargar imagenes para el mundo 
      tomb = processing.loadImage("images/tomb.png"); 
      muro = processing.loadImage('images/muro0.png'); 
      muro1 = processing.loadImage('images/muro01.png');
      muro2 = processing.loadImage('images/chime.png'); 
      bunueloimg = processing.loadImage('images/buñuelo.png');
      picos = processing.loadImage("images/picos.png");
      gameover = processing.loadImage("images/lose0.png");
      win = processing.loadImage("images/win0.png"); 
      natilla = processing.loadImage("images/natilla.png");
    }  
     
    // Dibuja algo en el canvas. Aqui se pone todo lo que quieras pintar
    processing.drawGame = function (world) {
       processing.background(0,0,0)
      
     function recursiveList(l,f,index=0){
        if(!isEmpty(l)){
          f(first(l),index);
          recursiveList(rest(l),f, index+1)
        }
      }    
      //define filas y columnas 
      recursiveList(mapa,(row, i) => {
        recursiveList(row,(cell, j)=> {
        
        /*Asigna los números correspondientes (que van en la matriz) a las imagenes del mundo con su respectiva configuración de posición y tamaño.
        *Los siguientes parametros serán iguales para todos los ifs establecidos (nombre de imagen, posicion x, posicion y, ancho maximo, largo maximo)*/
          
          if (cell==0){} //vacio habilitado
          if(cell==1){
            processing.image(muro, j * SIZE, i * SIZE, SIZE,SIZE); 
          }
          if(cell==2){
          processing.image(bunueloimg, j * SIZE, i * SIZE+10, SIZE,SIZE); 
          }
          if(cell==3){processing.image(muro1, j * SIZE, i * SIZE, SIZE,SIZE); 
          } 
          if(cell==4){
          processing.image(picos, j * SIZE, i * SIZE+10, SIZE, SIZE)
          }
          if(cell==5){
          processing.image(natilla, j * SIZE, i * SIZE+5, SIZE, SIZE)
          }
          if(cell==6){
          processing.image(muro2, j * SIZE, i * SIZE, SIZE, SIZE)
          }
        });
      });
      //Establecer la imagen de tomb, posición y tamaño
      processing.image(tomb,tombX,tombY,SIZE,SIZE);
      
      //Creación y configuración del agua (Será un rectángulo que modifica su tamaño.
      processing.fill(10,20,100,200); 
      processing.rect(0,y,WIDTH,HEIGHT); 
      y=y-velocidad; //velocidad final 
      /*Para detectar y desaparecer "buñuelos"(monedas) cuando tomb sobre pone su posición (añade sonido), aumenta los puntos, y para mostrar el contador en el HTML.
      matriz[fila][columnas] <- Navegación en la matriz*/
        if(mapa[(tombY)/30][(tombX)/30]==2){
          mapa[(tombY)/30][(tombX)/30]=0
          bunuelo.play();
          contador=contador+1
          contar.textContent  = "Puntos: "+contador;//para html
        }else if(mapa[(tombY)/30][(tombX)/30]==5){
          //Hace que el agua baje durante dos segundos y vuelva y suba al sobreponerse en una "natilla" y añade audio.
          velocidad = velocidad*-1
          bunuelo.play();
          mapa[(tombY)/30][(tombX)/30]=0
          //Para volver a subir el agua
          setTimeout(function(){if(pause==false){velocidad=0.3}}, 2000);
        }else if(mapa[(tombY)/30][(tombX)/30]==4 || y<=(tombY+27)){
          //Para detectar si tomb toca pinchos o agua (restar un punto a vidas), volver a posiciones iniciales (agua, tomb) y restaar una vida en el marcador del HTML.
          off.play();
          vidas= vidas-1
          tombX= 150
          tombY= 480
          y=540
          vidas1.textContent  = "Vidas: "+vidas; //para el html
        }else if(vidas==0){
          //Para la pantalla de game over (vidas=0)     
          conteomuerte=conteomuerte+1
          y=540
          velocidad=0
          processing.image(gameover,0,0,WIDTH,HEIGHT)
          //Tiempo de aparicion y desaparicion del texto en la pantalla de derrota
          if(conteomuerte%14==0){
            intentar=!intentar 
          }
        }else if(contador==cantidadpuntos12){
          //Para pantalla de win
          processing.image(win,0,0,WIDTH,HEIGHT)
          conteomuerte=conteomuerte+1
          y=540
          velocidad=0
          //Tiempo de aparicion y desaparicion del texto en la pantalla de victoria
          if(conteomuerte%14==0){
            intentar=!intentar
          }
        }
        //Para aparecer el texto cuando intentar==true (config. para titilar)
        if(intentar==true){
          processing.fill(255)
          processing.textSize(50);
          processing.text("Presiona enter para\nintentarlo de nuevo", 110, 450);
        }
    
        //Configuración de onKeyEvent para detectar teclas presionadas y agregar funcionalidades. (Movimiento, Funcionalidades adicionales.) 
        processing.onKeyEvent = function (world, keyCode) {
        if (keyCode==processing.UP && mapa[(tombY/30)-1][(tombX)/30]!=1 && mapa[(tombY/30)-1][(tombX)/30]!=3 && mapa[(tombY/30)-1][(tombX)/30]!=6 && pause!= true && vidas!= 0 && contador<cantidadpuntos12){
          tombY=tombY-30;
        }
        if (keyCode==processing.DOWN && mapa[(tombY/30)+1][(tombX)/30]!=1&& mapa[(tombY/30)+1][(tombX)/30]!=3 && mapa[(tombY/30)+1][(tombX)/30]!=6 && pause!= true && vidas!= 0 && contador<cantidadpuntos12){
         return tombY=tombY+30;
        }
        if (keyCode==processing.LEFT && mapa[(tombY)/30][(tombX/30)-1]!=1&& mapa[(tombY)/30][(tombX/30)-1]!=3 && mapa[(tombY)/30][(tombX/30)-1]!=6 && pause!= true && vidas!= 0 && contador<cantidadpuntos12 ){
         return  tombX=tombX-30;
        }
        if (keyCode==processing.RIGHT && mapa[(tombY)/30][(tombX/30)+1]!=1 && mapa[(tombY)/30][(tombX/30)+1]!=3  && mapa[(tombY)/30][(tombX/30)+1]!=6 && pause!= true && vidas!= 0 && contador<cantidadpuntos12 ){
         return tombX=tombX+30;
        }
        //Funcionalidades adicionales
        //Al perder o al ganar, ENTER para volver el mundo a su estado inicial.
        if(keyCode==processing.ENTER){
          if(vidas==0 || contador==cantidadpuntos12){
          mapa = [[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
               [3,0,2,0,3,0,0,0,0,0,0,0,0,0,0,0,0,3,0,2,0,3],
               [3,0,6,5,3,0,0,6,2,1,2,0,0,1,2,6,0,3,5,6,0,3],
               [3,0,3,1,3,0,1,1,1,1,1,0,1,1,1,1,0,3,1,3,0,3],
               [3,0,0,0,0,0,0,0,0,0,4,5,4,0,0,0,0,0,0,0,0,3],
               [3,0,1,1,0,4,6,0,1,1,1,1,1,1,0,6,4,0,1,1,0,3], 
               [3,0,3,2,0,1,1,0,2,4,0,0,0,4,0,1,1,0,2,3,0,3],
               [3,0,3,1,0,2,3,0,1,1,0,1,1,1,0,3,2,0,1,3,0,3],
               [3,0,3,2,0,1,3,0,0,2,2,5,2,0,0,3,1,0,2,3,0,3],
               [3,0,3,1,0,2,3,0,1,1,1,1,1,1,0,3,2,0,1,3,0,3],
               [3,0,3,2,0,1,3,0,0,4,2,5,2,0,0,3,1,0,2,3,0,3],
               [3,0,3,1,0,2,3,0,1,1,1,1,1,1,0,3,2,0,1,3,0,3],
               [3,0,3,0,0,1,3,0,0,0,0,0,4,0,0,3,1,0,0,3,0,3],
               [3,0,0,0,0,0,0,0,1,1,1,1,1,1,0,0,0,0,0,0,0,3],
               [3,0,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,0,3],
               [3,0,3,5,3,0,1,1,1,1,1,1,1,1,1,1,0,3,5,3,0,3],
               [3,2,0,0,3,0,0,2,2,2,4,2,2,2,2,0,0,3,0,0,2,3],
               [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]];

           //hay que tener en cuenta que absolutamente todo se reinicia.
          
           y=540;
           velocidad=0.3; 
           contador= 0;
           vidas = 3;
           tombX = 150; 
           tombY = 480;
           pausatext= false
           conteomuerte = 13;
           intentar = false
           vidas1.textContent  = "Vidas: "+vidas;
           contar.textContent  = "Puntos: "+contador;
          }
        }        
        //ESPACIO mientras el juego está en marcha, se pausará y si se encuentra páusado se reanudará.
        if(keyCode=='32' && contador<cantidadpuntos12 && vidas>=1 && vidas<=3) {
          pause= !pause
          if(pause==true){
            velocidad=0;
            fondopause(); 
          }else{
            velocidad=0.3;
          }
        }
        }
        if(pause==true){ //crea el texto de pausa, con su tamaño.
          processing.fill(255)
          processing.textSize(100);
          processing.text("Pausado", 140, 300);

          
          processing.fill(255) //crea el texto de pausa, con su tamaño.
          processing.textSize(30);
         processing.text("Presiona barra espaciadora para reanudar", 50, 400);
        }else{
          fondo.play();
        }
        
    }

    // Actualiza el mundo despues de cada frame. En este ejemplo, no cambia nada, solo retorna una copia del mundo
    processing.onTic = function (world) {
      return make(world, {});
    }


    //Implemente esta función si quiere que su programa reaccione a eventos del mouse
    processing.onMouseEvent = function (world, event) {
      // Por ahora no cambia el mundo. Solo retorna una copia del mundo actual
      return make(world, {});
    };   

    // ******************** De aquí hacia abajo no debe cambiar nada. ********************

    // Esta es la función que pinta todo. Se ejecuta n veces por segundo. 
    // No cambie esta función. Su código debe ir en drawGame
    processing.draw = function () {
      processing.drawGame(processing.state);
      processing.state = processing.onTic(processing.state);
    };

    // Esta función se ejecuta cada vez que presionamos una tecla. 
    // No cambie esta función. Su código debe ir en onKeyEvent
    processing.keyPressed = function () {
      processing.state = processing.onKeyEvent(processing.state, processing.keyCode);
    }

    // Esta función se ejecuta cada vez movemos el mouse. 
    // No cambie esta función. Su código debe ir en onKeyEvent
    processing.mouseMoved = function () {
      processing.state = processing.onMouseEvent(processing.state,
        { action: "move", mouseX: processing.mouseX, mouseY: processing.mouseY });
    }

    // Estas funciones controlan los eventos del mouse. 
    // No cambie estas funciones. Su código debe ir en OnMouseEvent
    processing.mouseClicked = function () {
      processing.state = processing.onMouseEvent(processing.state,
        { action: "click", mouseX: processing.mouseX, mouseY: processing.mouseY, mouseButton: processing.mouseButton });
    }

    processing.mouseDragged = function () {
      processing.state = processing.onMouseEvent(processing.state,
        { action: "drag", mouseX: processing.mouseX, mouseY: processing.mouseY, mouseButton: processing.mouseButton });
    }

    processing.mousePressed = function () {
      processing.state = processing.onMouseEvent(processing.state,
        { action: "press", mouseX: processing.mouseX, mouseY: processing.mouseY, mouseButton: processing.mouseButton });
    }

    processing.mouseReleased = function () {
      processing.state = processing.onMouseEvent(processing.state,
        { action: "release", mouseX: processing.mouseX, mouseY: processing.mouseY, mouseButton: processing.mouseButton });
    }
    // Fin de los eventos del mouse
  }

  var canvas = document.getElementById("canvas");

  // Adjuntamos nuestro sketch al framework de processing
  var processingInstance = new Processing(canvas, sketchProc);
