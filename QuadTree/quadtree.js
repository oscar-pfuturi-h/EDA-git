class Point {
	constructor (x, y, userData ){
		this.x = x;
		this.y = y;
		this.userData = userData ;
	}
}

class Rectangle {
	constructor (x, y, w, h){
		this.x = x; // center
		this.y = y;
		this.w = w; // half width
		this.h = h; // half height
	}
	// verifica si este objeto contiene un objeto Punto
	contains(point){
		if (point.x >= this.x - this.w && point.x <= this.x + this.w && 
			point.y >= this.y - this.h && point.y <= this.y + this.h){
			return 1;
		}
		return 0;
	}
	// verifica si este objeto se intersecta con otro objeto Rectangle
	intersects(range){
		return !(range.x - range.w > this.x + this.w || range.x + range.w < this.x - this.w ||
				range.y - range.h > this.y + this.h || range.y + range.h < this.y - this.h);
	}
}

class QuadTree {
	constructor(boundary,n){
		this.boundary = boundary ; // Rectangle
		this.capacity = n; // capacidad maxima de cada cuadrante
		this.points = []; // vector , almacena los puntos a almacenar
		this.divided = false ;
	}
	// divide el quadtree en 4 quadtrees
	subdivide(){
		const qt_northeast = new QuadTree;
		const qt_northwest = new QuadTree;
		const qt_southeast = new QuadTree;
		const qt_southwest = new QuadTree;
		this.northeast = qt_northeast ;
		this.northwest = qt_northwest ;
		this.southeast = qt_southeast ;
		this.southwest = qt_southwest ;

		this.divided = true;
	}

	insert(point){
		if (!this.boundary.contains(point)){
			return ;
		}
		if (this.points.length < this.capacity){
			this.points.push(point);
		}
		else {
			subdivide();
			this.northeast.push(point);
			this.northwest.push(point);
			this.southeast.push(point);
			this.southwest.push(point);
		}
	}

	show(){
		stroke(255);
		strokeWeight(1);
		noFill();
		rectMode(CENTER);
		rect(this.boundary.x, this.boundary.y, this.boundary.w*2 , this.boundary.h *2);
		if (this.divided){
			this.northeast.show();
			this.northwest.show();
			this.southeast.show();
			this.southwest.show();
		}
		for (let p of this.points){
			strokeWeight(4);
			point(p.x, p.y);
		}
	}
}