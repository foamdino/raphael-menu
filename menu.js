$(document).ready(function() {
	var paper = new Raphael($('#canvas_container'), 50, 500);
	var circle = paper.circle(200, 200, 80);
	//circle.attr({stroke-width:'0'});
	var main_menu = getMenu();
	draw_options(paper, main_menu['children'], main_menu);
	//circle.attr({stroke:'none', fill:'blue'});
});

function draw_options(paper, menu, parent) {
	var layer = [];
	var siblings = get_siblings(getMenu()['children'], parent);

	for(var i=0; i < menu.length; i++) {
		var o = eval( menu[i] );
		var menu_option = o['option'];
		var angle_inc = 360/menu.length;
		var angle = angle_inc * (i+1);
		coords = calculate_position(80, 200, 200, angle)
		var c;
		var text;
		if(angle == 360) {
			c = paper.circle(coords[0],coords[1]-15,10);
			text = paper.text(coords[0]+30, coords[1]-15, menu_option);
		} else if(angle < 180) {
			text = paper.text(coords[0]+40, coords[1]+10, menu_option);
			c = paper.circle(coords[0]+10,coords[1]+10,10);
		} else {
			c = paper.circle(coords[0]-10,coords[1]+10,10);
			text = paper.text(coords[0]-40, coords[1]+10, menu_option);
		}
		c.attr({stroke:'none', fill:'blue'});
		text.attr({fill:'blue'});
		if(typeof o['link'] !== 'undefined' && undefined != o['link']) {
			c.attr({href:o['link']});
		}

		// add glow effect
		c.hover(
			function() {
				this.g = this.glow({color: "#06F", width: 4});
			},
			function() {
				if(this.g !== null && undefined !== this.g) {
					this.g.remove();
				}
			}
		);

		layer.push(c);
		layer.push(text);
		
		if(typeof o['children'] !== 'undefined' && undefined !== o['children'] && o['children'].length > 0) {
			c.click(
				function() {
					this.g.remove();
				}
				
			);
			c.node.onclick = menu_activation(paper, o['children'], layer, o);
		}
		
	}

	if(typeof parent !== 'undefined' && undefined !== parent) {
		if(parent['option'] !== 'menu' && !parent_is_at_same_level(menu, parent)) {
			var c = paper.circle(200, 200, 10);
			c.attr({stroke:'none', fill:'red'});
			var text = paper.text(220, 200, parent['option']);
			text.attr({fill:'blue'});
			c.hover(
				function() {
					this.g = this.glow({color: "#06F", width: 4});
				},
				function() {
					if(null !== this.g && undefined !== this.g && typeof this.g !== 'undefined') {
						this.g.remove();
					}
				}
			);

			layer.push(c);
			layer.push(text);
			
			c.click(
				function() {
					if(null !== this.g && undefined !== this.g && typeof this.g !== 'undefined') {
						this.g.remove();
					}
				}
			);
			
			c.node.onclick = menu_activation(paper, siblings, layer, parent);
			
		} 
	} 
}

function parent_is_at_same_level(menu, parent) {
	for(var i=0; i<menu.length; i++) {
		if(menu[i]['option'] === parent['option']) {
			return true;
		}
	}
	return false;
}

function get_siblings(menu, parent) {
	var correct_level = false;
	var siblings = [];
	if(parent_is_at_same_level(menu, parent)) {
		for(var i=0; i< menu.length; i++) {
			siblings[i] = menu[i];
		}
		return siblings;
	} else {
		for(var i=0; i<menu.length; i++) {
			get_siblings(menu[i], parent);
		}
	}
}

function clean_up(paper, layer) {
	var paper_dom = paper.canvas;
	for(var i=0; i<layer.length; i++) {
		var e = layer[i];
		if(null !== e && undefined !== e && typeof e !== 'undefined') {
			e.remove();
		}
	}
}


function menu_activation(paper, submenu, layer, parent) {
	var f = function() {
		clean_up(paper, layer);
		draw_options(paper, submenu, parent);
	}
	return f;
}

function calculate_position(radius, origin_x, origin_y, angle) {
	var x = origin_x+radius*Math.sin(angle*Math.PI/180);
	var y = origin_y+radius*-Math.cos(angle*Math.PI/180);
	return [x,y];
}

// used for testing, the contents can be replaced with a call to a service to get the correct menu structure
function getMenu() {
	return {'option':'menu', 'children':[
		{'option':'a', 'children': [
			{'option':'a.1','link':'http://www.google.com','children':[]},
			{'option':'a.2', 'children': []},
			{'option':'a.3', 'children': []},
			{'option':'a.4', 'children': []}
		]},
		{'option':'b', 'children': [
			{'option':'b.1', 'children':[]},
			{'option':'b.2', 'children':[]},
			{'option':'b.3', 'children':[]}
		]},
		{'option':'c', 'children': [
			{'option':'c.1', 'children':[]},
			{'option':'c.2', 'children':[]}
		]}
	]};
}