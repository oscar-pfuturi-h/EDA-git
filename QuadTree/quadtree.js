class Point {
	constructor(x, y, userData) {
		this.x = x;
		this.y = y;
		this.userData = userData ;
	}
}

class Rectangle {
	constructor(x, y, w, h) {
		this.x = x; // center
		this.y = y;
		this.w = w; // half width
		this.h = h; // half height
	}
	// verifica si este objeto contiene un objeto Punto
	contains(point) {
		if (point.x >= this.x - this.w && point.x <= this.x + this.w && 
			point.y >= this.y - this.h && point.y <= this.y + this.h){
			return 1;
		}
		return 0;
	}
	// verifica si este objeto se intersecta con otro objeto Rectangle
	intersects(range) {
		return !(range.x - range.w > this.x + this.w || range.x + range.w < this.x - this.w ||
				range.y - range.h > this.y + this.h || range.y + range.h < this.y - this.h);
	}
}

class QuadTree {
	constructor(boundary, n) {
		this.boundary = boundary; // Rectangle
		this.capacity = n; // capacidad maxima de cada cuadrante
		this.points = []; // vector , almacena los puntos a almacenar
		this.divided = false;
	}
	// divide el quadtree en 4 quadtrees
	subdivide() {
		let x = this.boundary.x;
		let y = this.boundary.y;
		let w = this.boundary.w;
		let h = this.boundary.h;

		let r_northeast = new Rectangle(x + w/2, y + h/2, w/2, h/2);
		let r_northwest = new Rectangle(x - w/2, y + h/2, w/2, h/2);
		let r_southeast = new Rectangle(x + w/2, y - h/2, w/2, h/2);
		let r_southwest = new Rectangle(x - w/2, y - h/2, w/2, h/2);
		this.northeast = new QuadTree(r_northeast, this.capacity);
		this.northwest = new QuadTree(r_northwest, this.capacity);
		this.southeast = new QuadTree(r_southeast, this.capacity);
		this.southwest = new QuadTree(r_southwest, this.capacity);

		this.divided = true;
	}

	insert(point) {
		if (!this.boundary.contains(point)) {
			return ;
		}
		if (this.points.length < this.capacity) {
			this.points.push(point);
		}
		else {
			if (!this.divided) {
				this.subdivide();
			}
			this.northeast.insert(point);
			this.northwest.insert(point);
			this.southeast.insert(point);
			this.southwest.insert(point);
		}
	}

	query(range, found) {//Rectangle & points, resp.
		if (this.boundary.intersects(range)) {
			if (this.divided) {
				this.northeast.query(range, found);
				this.northwest.query(range, found);
				this.southeast.query(range, found);
				this.southwest.query(range, found);
			}
			for (let p of this.points) {
				if (range.contains(p)) {
					found.push(p);
					count++;  // -------
				}
			}
			
		}
	}

	show() {
		stroke(255);
		strokeWeight(1);
		noFill();
		rectMode(CENTER);
		rect(this.boundary.x, this.boundary.y, this.boundary.w*2, this.boundary.h*2);
		if (this.divided) {
			this.northeast.show();
			this.northwest.show();
			this.southeast.show();
			this.southwest.show();
		}
		for (let p of this.points) {
			strokeWeight(4);
			point(p.x, p.y);
		}
	}
}