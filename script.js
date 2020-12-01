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
  
  
  /*
   * Se definen los mundos
   * let, var, const name = null; 
   * No requiere interacción con el usuario
   */ 
  
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
  let tombX = 150; // Posición x del tomb
  let tombY = 480; // posicion y del tomb
  let tomb = null; //instanciar un "objeto" vacio y usarlo para la imagen de tomb
  let contador = 0; //contador de buñuelos
  let vidas = 3; //contador de vidas
  let gameover=null; //instanciar un "objeto" vacio y usarlo para la imagen de game over
  let y=540; //posicion y del agua
  let velocidad=0.3; //velocidad a la que se mueve el agua
  let alto_agua=500; //es el alto del rectangulo del agua
  let pause = false //determinar si el juego está en pausa o no
  let pausatext= false //boolean que determina si se muestra el texto de pausa o no
  let natilla = null //instanciar un "objeto" vacio y usarlo para la imagen de la natilla
  let conteomuerte = 13 //despues
  let intentar = false //despues

  //establecer un sonido para el fondo (con sus respectivas caracteristicas)
  var fondo = new buzz.sound("sounds/fondo2.mp3", {
    preload: true,
    volume: 10,
  });
  //establecer un sonido de muerte(con sus respectivas caracteristicas)
  var off = new buzz.sound("sounds/off.mp3", {
    volume: 30 
  });
  //establecer un sonido al momento de comer un buñuelo
  var bunuelo = new buzz.sound("sounds/paso1.wav"); 

  function sketchProc(processing) {

    /**
     * Esto se llama antes de iniciar (espacio de trabajo)
     */
    processing.setup = function () {
       
      processing.frameRate(20); //establecer el frameRate del proyecto
      processing.size(WIDTH,HEIGHT); //Establecer el tamaño del area de trabajo con la anchura y altura del mapa 
      tomb = processing.loadImage("images/tomb.png"); //cargar imagen para tomb
      muro = processing.loadImage('images/muro0.png'); //cargar imagen para los muros
      muro1 = processing.loadImage('images/muro01.png'); //cargar imagen para los muros
      muro2 = processing.loadImage('images/chime.png'); //cargar imagen para los muros
      moneda = processing.loadImage('images/buñuelo.png'); //cargar imagen para la moneda
      picos = processing.loadImage("images/picos.png");//carga la imagen para monster
      gameover = processing.loadImage("images/lose0.png");//cargar imagen para gameover
      win = processing.loadImage("images/win0.png"); //carga imagen para cuando se gana
      natilla = processing.loadImage("images/natilla.png"); //carga imagen de la natilla
    }  
     

    // Dibuja algo en el canvas. Aqui se pone todo lo que quieras pintar
    processing.drawGame = function (world) {
       processing.background(0,0,0) //Establece el color del entorno de trabajo
      
     function recursiveList(l,f,index=0){
        if(!isEmpty(l)){
          f(first(l),index);
          recursiveList(rest(l),f, index+1)
        }
      }    
      //define filas y columnas 
      recursiveList(mapa,(row, i) => {
        recursiveList(row,(cell, j)=> {
        
        //los siguientes parametros serán iguales para todos los ifs establecidos *nombre de imagen, posicion x, posicion y, ancho maximo, largo maximo/*

          if(cell==1){//establecer la imagen de los muros, posición y tamaño
          processing.image(muro, j * SIZE, i * SIZE, SIZE,SIZE); 
          }
          if(cell==3){//establecer la imagen de los muros verticales, posición y tamaño
          processing.image(muro1, j * SIZE, i * SIZE, SIZE,SIZE); 
          } 
          if (cell==0){ //representa un vacio en el mapa (lugar hablitado para andar)
          }
          if(cell==2){//establecer la imagen de la "comida", posición y tamaño
          processing.image(moneda, j * SIZE, i * SIZE+10, SIZE,SIZE); 
          }
          if(cell==4){ //establecer la imagen de los picos, posición y tamaño
          processing.image(picos, j * SIZE, i * SIZE+10, SIZE, SIZE)
          }
          if(cell==5){ //establecer la imagen de la supernatilla, posición y tamaño
          processing.image(natilla, j * SIZE, i * SIZE+5, SIZE, SIZE)
          }
          if(cell==6){ //establecer la imagen de la chimenea
          processing.image(muro2, j * SIZE, i * SIZE, SIZE, SIZE)
          }
        });
      });
      //establecer la imagen del tomb, posición y tamaño
      processing.image(tomb,tombX,tombY,SIZE,SIZE);
      
      //detectar cuando tomb toca "buñuelos" (sumar puntos y mostrar en consola)matriz[fila][columnas]
        if(mapa[(tombY)/30][(tombX)/30]==2){
          bunuelo.play();//Inicia el audio bunuelo
          contador=contador+1
          mapa[(tombY)/30][(tombX)/30]=0//desaparecer buñuelo
          contar.textContent  = "Puntos: "+contador; //mostrar en el html el contador
        }else if(mapa[(tombY)/30][(tombX)/30]==5){
          velocidad = velocidad*-1 //Vuelve negativo el crecimiento del rectángulo del agua (lo hace devolver)
          bunuelo.play();
          mapa[(tombY)/30][(tombX)/30]=0
          setTimeout(function(){if(pause==false){velocidad=0.3}}, 2000);//se ejecuta la funcion despues de 2000 ms(1segundo=1000ms) para volver a subir el agua
        }else if(mapa[(tombY)/30][(tombX)/30]==4 || y<=(tombY+27)){ //detectar si tomb toca pinchos o agua (restar un punto a vidas) y volver a posiciones iniciales (agua, tomb)
          off.play();
          vidas= vidas-1
          tombX= 150//posicion inicial del tomb en X
          tombY= 480//posicion inicial del tomb en Y
          y=540////posicion inicial del agua en Y
          vidas1.textContent  = "Vidas: "+vidas; //Para mostrar las vidas en HTML
        }else if(vidas==0){ //mostrar la pantalla de gameover cuando vidas = 0        
          conteomuerte=conteomuerte+1
          y=540
          velocidad=0
          processing.image(gameover,0,0,WIDTH,HEIGHT)
          if(conteomuerte%14==0){
            intentar=!intentar
          }
        }else if(contador==cantidadpuntos12){ //mostrar pantalla de win, si no queda algúna "comida" sobrante
          processing.image(win,0,0,WIDTH,HEIGHT)
          conteomuerte=conteomuerte+1
          y=540
          velocidad=0
          if(conteomuerte%14==0){
            intentar=!intentar
          }
     }
     
     
      processing.fill(10,20,100,200); //pinta el rectangulo del agua con su respectiva opacidad
      processing.rect(0,y,WIDTH,HEIGHT); //crea un figura en una posición dada, que representa el agua (rectangulo).
      y=y-velocidad; //establece la velocidad final del agua
     
      //detectar que tecla está presionada y determinar cual será su función 
      processing.onKeyEvent = function (world, keyCode) {

        // hacer mover a tomb una posición arriba, teniendo en cuenta las condiciones establecidas

        if (keyCode==processing.UP && mapa[(tombY/30)-1][(tombX)/30]!=1 && mapa[(tombY/30)-1][(tombX)/30]!=3 && mapa[(tombY/30)-1][(tombX)/30]!=6 && pause!= true && vidas!= 0 && contador<cantidadpuntos12){
          tombY=tombY-30;
        }
        //hacer mover a tomb una posición abajo, teniendo en cuenta las condiciones establecidas
        if (keyCode==processing.DOWN && mapa[(tombY/30)+1][(tombX)/30]!=1&& mapa[(tombY/30)+1][(tombX)/30]!=3 && mapa[(tombY/30)+1][(tombX)/30]!=6 && pause!= true && vidas!= 0 && contador<cantidadpuntos12){
         return tombY=tombY+30;
        }
        //hacer mover a tomb una posición a la izquierda, teniendo en cuenta las condiciones establecidas
        if (keyCode==processing.LEFT && mapa[(tombY)/30][(tombX/30)-1]!=1&& mapa[(tombY)/30][(tombX/30)-1]!=3 && mapa[(tombY)/30][(tombX/30)-1]!=6 && pause!= true && vidas!= 0 && contador<cantidadpuntos12 ){
         return  tombX=tombX-30;
        }
        //hacer mover a tomb una posición a la derecha, teniendo en cuenta las condiciones establecidas
        if (keyCode==processing.RIGHT && mapa[(tombY)/30][(tombX/30)+1]!=1 && mapa[(tombY)/30][(tombX/30)+1]!=3  && mapa[(tombY)/30][(tombX/30)+1]!=6 && pause!= true && vidas!= 0 && contador<cantidadpuntos12 ){
         return tombX=tombX+30;
        }
        //si presionas enter al perder o al ganar, el juego volverá a su estado inicial
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
        //si presionas "espacio" mientras el juego está en marcha, se pausará (en caso contrario, reanudará)  
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
        if(pause==true){ //crea un texto y lo pinta (pausado), con su tamaño.
          processing.fill(255)
          processing.textSize(100);
          processing.text("Pausado", 140, 300);

          
          processing.fill(255) //crea un texto y lo pinta (reanudar), con su tamaño.
          processing.textSize(30);
         processing.text("Presiona barra espaciadora para reanudar", 50, 400);
        }else{
          fondo.play();
        }
        if(intentar==true){
         
          processing.fill(255) //crea un texto y lo pinta (reintentar), con su tamaño.
          processing.textSize(50);
          processing.text("Presiona enter para\nintentarlo de nuevo", 110, 450);
          
         
        }
    }

    // Actualiza el mundo despues de cada frame. En este ejemplo, no cambia nada, solo retorna una copia del mundo
    processing.onTic = function (world) {
      return make(world, {});
    }
   

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
