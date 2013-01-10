var Navigation = {
	init: function(){
		$("body > nav")
			.mouseup(function(e){
				if (e.target == e.currentTarget)
					$("body").toggleClass("left-open").trigger("resize")
			})
			// Add effects on mouseover to toggle the pan
			.mouseover(function(e){
				if (e.target == e.currentTarget)
					$(this).addClass("over")
				else
					$(this).removeClass("over")
			})
			.mouseout(function(e){
				$(this).removeClass("over")
			})

		$("#switch").click(function(e){
			e.preventDefault()
			$(this).toggleClass("open")
		})
		$("body > aside").click(function(){
			$("body").toggleClass("right-open").trigger("resize")
		})
	}
}
