var abaya_total = 0;

//localStorage.clear();

//var base_url = "https://public.zeddevelopers.com/app/Myde%20Abaya/";
var base_url = "https://mydeabayaapp.com/app_services/";
var base_web = "https://mydeabayaapp.com/";
var page = "landing";

var design = {};
var design_history = [];

fabric_json 		= null;
size_json 			= null;
width_json 			= null;
sleeve_json 		= null;
neckline_json 	= null;
closing_json 		= null;
pocket_json 		= null;
belt_json 			= null;
pleats_json 		= null;
edges_json 			= null;
crystal_json 		= null;
embroidery_json = null;

function color_categories(){
	var category_colors 	= ["d0a07c","bb977d","c0a695","a79d93","9c9084","878076"];
	var category_colors_i	= 0;

	$(".features_list_detailed li").each(function(){
			if(category_colors_i >= category_colors.length){
				category_colors_i = 0;
			}

			$(this).css("background-color","#"+category_colors[category_colors_i]);
			category_colors_i++;
	});
}


function go_back(){


	$(".popup-full-custom").removeClass('active');

	$(".popup-half").removeClass('active');//close all on click -> .design_sketch
	color_categories();


	$(".panel-right, .panel-overlay").removeClass("active");
	$(".with-panel-right-reveal").removeClass("with-panel-right-reveal");
	$(".panel-overlay").removeAttr("style");



	$(".popup-half").removeClass('active');
	if(page == "main_page"){

	}else if(page == "landing" || page == "design" || page == "step_1"){
		if($(".design_sketch").hasClass("zoom_div")){
				$(".design_sketch").removeClass("zoom_div");
				$(".zoom_div_close").fadeIn();
		}else{
			if(window.localStorage.getItem('valid_device') == "true"){
				//$(".logout").click();
			}else{

			}
		}

		/*


		}else{
			$("#title_bar").hide();
			$("#designing_page").hide();
			$("#my_orders").hide();
			$("#my_profile").hide();
			$("#order_success_page").hide();
			$("#landing_page").fadeIn("slow");
		}
		*/
	}else if(page == "step_2"){
		$(".step_1").click();
	}else if(page == "step_3" || page == "shipping"){
		$(".step_2").click();
	}else if(page == "payment"){
		$(".step_3").click();
	}else if(page == "order_complete" || page == "my_orders"){
		$("#my_orders").hide();
		$("#my_profile").hide();
		$("#order_success_page").hide();
		$("#landing_page").hide();

		$("#designing_page").fadeIn("slow");
		$(".step_1").click();
	}else{
		$("#my_orders").hide();
		$("#my_profile").hide();
		$("#order_success_page").hide();
		$("#landing_page").hide();

		$("#designing_page").fadeIn("slow");
		$(".step_1").click();
	}

	$(".popup-half").removeClass('active');


	window.scrollTo(0, 0);
}


var app = {
    initialize: function() {
      document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
			document.addEventListener('backbutton', go_back, false);
    },
    onDeviceReady: function() {
		this.receivedEvent('deviceready');






		$(document).ready(function(){

			function express_ship(){
				$.ajax({
					url:   base_url+"express_ship.php",
					data: {},
					type: 'GET',
					dataType: 'html',
					beforeSend: function(xhr){
					},
					success: function(response){
						response = $.parseJSON(response);
						if(response.fee == false){
							$(".express_courier_option").hide();
						}else{
							$(".express_courier_option").show();

							$(".shipping_type_2").attr("fees",response.fee);

							$(".express_courier").html("("+response.fee+" SAR)");

							render_final_cost(abaya_total);
						}
					},error:function(){
						setTimeout(function(){
							express_ship();
						},3000);
					}
				});
			}
			function regions(){
				$.ajax({
					url:   base_url+"address.php?type=r",
					data: {},
					type: 'GET',
					dataType: 'html',
					beforeSend: function(xhr){
					},
					success: function(response){
						response = $.parseJSON(response);
						$("select[name='regions'], select[name='regions_2']").html("<option>Region</option>");
						$.each(response,function(key,value){
							$("select[name='regions'], select[name='regions_2']").append("<option value='"+(value.id)+"'>"+(value.name)+"</option>");
						});
					},error:function(){
						setTimeout(function(){
							regions();
						},3000);
					}
				});
			}

			function standard_post(){
				$.ajax({
					url:   base_url+"shipping_fee.php",
					data: {
						r_id : $("select[name='regions']").val(),
						d_id : $("select[name='districts']").val(),
						t_id : $("select[name='townships']").val()
					},
					type: 'GET',
					dataType: 'html',
					beforeSend: function(xhr){
					},
					success: function(response){
						response = $.parseJSON(response);
						$(".standard_post").html("("+response.fee+" SAR)");
						$(".shipping_type_1").attr("fees",response.fee);
						render_final_cost(abaya_total);
					},error:function(){
					}
				});
			}

			$("input[name='shipping_type']").change(function(){
				var type = $("input[name='shipping_type']:checked").val();
				var fees = $("input[name='shipping_type']:checked").attr("fees");
				console.log({type, fees});
				render_final_cost(abaya_total);
			});

			/*
			cordova.plugins.notification.local.on('open', function (notification, eopts) {
				//alert(JSON.stringify(eopts));
			});
			*/

			window.localStorage.setItem("promotion",null);

			function app_promotion(){
				$.ajax({
					url:   base_url+"promotion.php",
					data: {
					},
					type: 'GET',
					dataType: 'html',
					beforeSend: function(xhr){
					},
					success: function(response){

						var promotion = window.localStorage.getItem("promotion");

						if(promotion != response){
							window.localStorage.setItem("promotion",response); //old
							response = $.parseJSON(response);
							if(response.title == "" && response.description == ""){

							}else{
								try{
									navigator.vibrate(200);
								}catch(e){console.log(e)}

								try{
									cordova.plugins.notification.local.schedule({
										id: response.id,
										//href: data.href,
										title: response.title,
										text: response.description,
										smallIcon: 'res://mipmap/icon',
										attachments: [response.image_url],
										icon: response.image_url,
										//actions: [{id:"open",title:"Open"}]
									});
								}catch(e){
									console.log(response);
								}
							}
						}

						setTimeout(function(){
							app_promotion();
						},3000);
					},error:function(){
						setTimeout(function(){
							app_promotion();
						},3000);
					}
				});
			}

			app_promotion();
			regions();
			express_ship();

			$("select[name='regions']").change(function(){
				$.get(base_url+"address.php?type=d&r_id="+$(this).val(),function(response){
					response = $.parseJSON(response);
					$("select[name='districts']").html("<option>District</option>");
					$.each(response,function(key,value){
						$("select[name='districts']").append("<option value='"+(value.id)+"'>"+(value.name)+"</option>");
					});
				});
				standard_post();
			});
			$("select[name='districts']").change(function(){
				$.get(base_url+"address.php?type=t&d_id="+$(this).val()+"&r_id="+$("select[name='regions']").val(),function(response){
					response = $.parseJSON(response);
					$("select[name='townships']").html("<option>Township</option>");
					$.each(response,function(key,value){
						$("select[name='townships']").append("<option value='"+(value.id)+"'>"+(value.name)+"</option>");
					});
				});
				standard_post();
			});

			$("select[name='townships']").change(function(){
				standard_post();
			});

			$("select[name='regions_2']").change(function(){
				$.get(base_url+"address.php?type=d&r_id="+$(this).val(),function(response){
					response = $.parseJSON(response);
					$("select[name='districts_2']").html("<option>District</option>");
					$.each(response,function(key,value){
						$("select[name='districts_2']").append("<option value='"+(value.id)+"'>"+(value.name)+"</option>");
					});
				});
			});
			$("select[name='districts_2']").change(function(){
				$.get(base_url+"address.php?type=t&d_id="+$(this).val()+"&r_id="+$("select[name='regions_2']").val(),function(response){
					response = $.parseJSON(response);
					$("select[name='townships_2']").html("<option>Township</option>");
					$.each(response,function(key,value){
						$("select[name='townships_2']").append("<option value='"+(value.id)+"'>"+(value.name)+"</option>");
					});
				});
			});

			setTimeout(function(){

				$(".popup, .popup-full, .popup-half").css("opacity","1");


				if(window.localStorage.getItem('valid_device') == "true"){
						$("#app_loading").hide(0,function(){
							auto_login();
						});
				}else{
					$("#app_loading").hide(0,function(){

						$( "#landing_page" ).animate({
					    opacity: 1,
					  }, 1000, function() {});

						if(window.localStorage.getItem('valid_device') == "true"){
							var login_id 			= window.localStorage.getItem("id");
							var draft_design 	= window.localStorage.getItem("design_"+login_id);
							var name 					= window.localStorage.getItem("name");
							var swal_text 		= "Good to see you!";

							if(draft_design != undefined && draft_design != null && draft_design.length > 0){
	 							draft_design = $.parseJSON(draft_design);
								$.each(draft_design,function(k,v){
									design_history.push({key:k,value:v}); //for btn_undo
								});
	 							design = draft_design;//restore
	 							render_image(draft_design);
	 							swal_text = "Draft design restored, you can complete your previous saved design.";
	 						}

							var name = window.localStorage.getItem('name');
							swal({
								title: "Design Restored!",
								text: swal_text,
								icon: "info",
								buttons: false,
								timer:3000,
							}).then((value) => {

								$("#landing_page").hide();
								$("#designing_page").show();

								$("#title_bar").hide();
								$("#title_bar").removeClass("hidden");
								$("#title_bar").show();
								page = "design";
							});
						}else{

							var login_id 			= window.localStorage.getItem("id");
							var draft_design 	= window.localStorage.getItem("design_null");
							var name 					= window.localStorage.getItem("name");
							var swal_text 		= "Good to see you!";

							if(draft_design != undefined && draft_design != null && draft_design.length > 0){
	 							draft_design = $.parseJSON(draft_design);
								$.each(draft_design,function(k,v){
									design_history.push({key:k,value:v}); //for btn_undo
								});
	 							design = draft_design;//restore
	 							render_image(draft_design);
	 							swal_text = "Draft design restored, you can complete your previous saved design.";

								swal({
									title: "Design Restored!",
									text: swal_text,
									icon: "info",
									buttons: false,
									timer:3000,
								}).then((value) => {

									$("#landing_page").hide();
									$("#designing_page").show();

									$("#title_bar").hide();
									$("#title_bar").removeClass("hidden");
									$("#title_bar").show();
									page = "design";
								});
	 						}else{
								setTimeout(function(){
									swal({
										title: "Alright, you made it!",
										text: "Welcome to Myde Abaya",
										icon: "success",
										timer: 3000,
										buttons: false
									});
								},500);
							}
						}


					});
				}
			},3000);

			function render_final_cost(abaya_total){
				$(".total_price").html(abaya_total+" SAR");
				$("#paypal_amount").val(abaya_total);

				var fees = $("input[name='shipping_type']:checked").attr("fees") || 0;
				$(".shipping_total").text(fees+" SAR");

				$("input[name='fee']").val(fees);

				var grand_total = +fees + +abaya_total;
				$(".total_after_shipping").text(grand_total+" SAR");
			}

			$('.qntyplusshop').click(function(e){

				e.preventDefault();
				var fieldName = $(this).attr('field');
				var currentVal = parseInt($('input[name='+fieldName+']').val());
				if (!isNaN(currentVal)) {
					$('input[name='+fieldName+']').val(++currentVal);
				} else {
					$('input[name='+fieldName+']').val(0);
				}
				var design_price = $(".designing_price").html();
				abaya_total = currentVal*design_price;
				render_final_cost(abaya_total);
			});

			$(".qntyminusshop").click(function(e) {
				e.preventDefault();
				var fieldName = $(this).attr('field');
				var currentVal = parseInt($('input[name='+fieldName+']').val());
				if (!isNaN(currentVal) && currentVal > 0) {
					$('input[name='+fieldName+']').val(--currentVal);
				} else {
					$('input[name='+fieldName+']').val(0);
				}
				var design_price = $(".designing_price").html();
				abaya_total = currentVal*design_price;
				render_final_cost(abaya_total);
			});


			$("#ForgotForm").submit(function(e){
				e.preventDefault();
				swal({
					title: "Comming soon",
					text: "This feature is coming soon",
					icon: "warning"
				});
			});

			$(".btn_main_page").click(function(){
				$("#landing_page").hide();
				$("#main_page").fadeIn("slow");
				page = "main_page";

				$(".main-data").css("bottom","0%");

				var bottom_precentage = 0;
				var bottom_animate = setInterval(function(){
					bottom_precentage += 0.6;
					if(bottom_precentage >= 20){
						clearInterval(bottom_animate);
					}
					$(".main-data").css({bottom: bottom_precentage+'%'});
				},10);

				/*get_pocket();
				get_belt();
				get_pleats();
				get_edges();
				get_crystal();
				get_embroidery();*/

			});

			$(".btn_get_started").click(function(){
				$("#landing_page, #main_page").hide();
				$("#designing_page").fadeIn("show");

				$("#title_bar").hide();
				$("#title_bar").removeClass("hidden");
				$("#title_bar").fadeIn("show");

				page = "design";
			});

			$(".step_1").click(function(){
				page = "step_1";
			});

			$(".facebook_btn").click(function(){
				CordovaFacebook.login({
				   permissions: ['email'],
				   onSuccess: function(result) {
				      if(result.declined.length > 0) {
				         //alert("The User declined something!");
				      }else{
								//alert("AA");
							}
				   },
				   onFailure: function(result) {
				      if(result.cancelled) {
				         //alert("The user doesn't like my app");
				      } else if(result.error) {
				         //alert("There was an error:" + result.errorLocalized);

								 	$("#landing_page, #main_page").hide();
					 				$("#designing_page").fadeIn("show");

					 				$("#title_bar").hide();
					 				$("#title_bar").removeClass("hidden");
					 				$("#title_bar").fadeIn("show");
									$(".popup-login").removeClass("active");

									window.localStorage.setItem('id',"");
									window.localStorage.setItem('name',"");
									window.localStorage.setItem('email',"");
									window.localStorage.setItem('pass',"");
									window.localStorage.setItem('valid_device', "true");

									auto_login();

					 				page = "design";

				      }
				   }
				});
			});

			$(".btn_google").click(function(){
				swal({
					title: 'Please wait..',
					text: "Connecting to Google",
					closeOnClickOutside: false,
					buttons: false,
					html: true
				});

				setTimeout(function(){
					swal({
						text: "mydeabayaapp.com is not whitelisted at Google",
						icon: "warning"
					});
				},20000);
			});

			var phone_is_verified = false;

			$(".go_to_next_step").click(function(){
				$(".step_2").click();
			});

			$(".step_2, .step_3").click(function(e){
				if(design.fabric == undefined){
					swal({
						title: "Fabric is required",
						text: "Please pick a fabric",
						icon: "info"
					}).then((value) => {
						$(".btn_load_fabric").click();
					});
					e.preventDefault();
				}else if(design.size == undefined){
					swal({
						title: "Size is required",
						text: "Please pick your size",
						icon: "info"
					}).then((value) => {
						$(".btn_load_size").click();
					});
					e.preventDefault();
				}else if(design.width == undefined){
					swal({
						title: "Width is required",
						text: "Please pick a width design",
						icon: "info"
					}).then((value) => {
						$(".btn_load_width").click();
					});
					e.preventDefault();
				}else if(design.sleeve == undefined){
					swal({
						title: "Sleeve is required",
						text: "Please pick a width sleeve",
						icon: "info"
					}).then((value) => {
						$(".btn_load_sleeve").click();
					});
					e.preventDefault();
				}else if(design.neckline == undefined){
					swal({
						title: "Neckline is required",
						text: "Please pick a neckline sleeve",
						icon: "info"
					}).then((value) => {
						$(".btn_load_neckline").click();
					});
					e.preventDefault();
				}else if(design.closing == undefined){
					swal({
						title: "Closing is required",
						text: "Please pick a closing",
						icon: "info"
					}).then((value) => {
						$(".btn_load_closing").click();
					});
					e.preventDefault();
				}else{
					//pricing calculation
					$(".design_details").empty();
					var total_price = 0;
					$.each(design,function(key,value){
						value = value-1;
						var price = 0;
						if(key == "width"){
							try{
								price = width_json[value].price;
							}catch(e){
								width_json = window.localStorage.getItem("width_json");
								width_json = $.parseJSON(width_json);
								price = width_json[value].price;
							}
						}else if(key == "sleeve"){
							try{
								price = sleeve_json[value].price;
							}catch(e){
								sleeve_json = window.localStorage.getItem("sleeve_json");
								sleeve_json = $.parseJSON(sleeve_json);
								price = sleeve_json[value].price;
							}
						}else if(key == "neckline"){
							try{
								price = neckline_json[value].price;
							}catch(e){
								neckline_json = window.localStorage.getItem("neckline_json");
								neckline_json = $.parseJSON(neckline_json);
								price = neckline_json[value].price;
							}
						}else if(key == "closing"){
							try{
								price = closing_json[value].price;
							}catch(e){
								closing_json = window.localStorage.getItem("closing_json");
								closing_json = $.parseJSON(closing_json);
								price = closing_json[value].price;
							}
						}else if(key == "pocket"){
							try{
								price = pocket_json[value].price;
							}catch(e){
								pocket_json = window.localStorage.getItem("pocket_json");
								pocket_json = $.parseJSON(pocket_json);
								price = pocket_json[value].price;
							}
						}else if(key == "belt"){
							try{
								price = belt_json[value].price;
							}catch(e){
								belt_json = window.localStorage.getItem("belt_json");
								belt_json = $.parseJSON(belt_json);
								price = belt_json[value].price;
							}
						}else if(key == "pleats"){
							try{
								price = pleats_json[value].price;
							}catch(e){
								pleats_json = window.localStorage.getItem("pleats_json");
								pleats_json = $.parseJSON(pleats_json);
								price = pleats_json[value].price;
							}
						}else if(key == "edges"){
							try{
								price = edges_json[value].price;
							}catch(e){
								edges_json = window.localStorage.getItem("edges_json");
								edges_json = $.parseJSON(edges_json);
								price = edges_json[value].price;
							}
						}else if(key == "fabric"){
							try{
								price = fabric_json[value].price;
							}catch(e){
								fabric_json = window.localStorage.getItem("fabric_json");
								fabric_json = $.parseJSON(fabric_json);
								price = fabric_json[value].price;
							}
						}else if(key == "size"){
							try{
								price = size_json[value].price;
							}catch(e){
								try{
									size_json = window.localStorage.getItem("size_json");
									size_json = $.parseJSON(size_json);
									price = size_json[value].price;
								}catch(e){
									price = 0;
								}
							}
						}
						console.log(price);
						total_price += +price;

						if(price > 0){
							$(".design_details").append('<li class="table_row">'+
							 '<div class="table_section table_th">'+(key)+':</div>'+
							 '<div class="table_section">'+(price)+' SAR</div>'+
							'</li>');
						}
					});

					$(".designing_price").html(total_price);
					var qty = +$("input[name='qntyshop']").val();
					if(isNaN(qty)){
						qty = 1;
					}

					abaya_total = qty*total_price;
					render_final_cost(abaya_total);

					color_categories();
					$(".popup-half").removeClass('active');

					if($(this).hasClass("step_2")){
						page = "step_2";
					}else if($(this).hasClass("step_3")){
						if(phone_is_verified == true){
							$(".sub_tab_payment_review").hide();
							$(".sub_tab_payment").fadeIn("slow");
						}else{
							e.preventDefault();
							verify_phone();
						}
					}
				}
			});

			$("select[country='country_code']").change(function(){
				phone_is_verified = false;
			})
			$("input[name='ship_phone']").keyup(function(){
				phone_is_verified = false;
			});




			function verify_phone(){


				if(window.localStorage.getItem('valid_device') != "true"){
					swal({
						title: "Please login",
						text: "Join Myde Abaya to submit your order!",
						icon: "warning"
					}).then((value) => {
						$(".popup-login").addClass('active');
					});
				}else{
					var phone = $("input[name='ship_phone']").val();
					var ccode = $("select[name='country_code'] option:selected").val();

					$("input[name='ship_phone']").css("border","0px solid transparent");
					$("select[name='country_code']").css("border","0px solid transparent");

					if(ccode.length == 0){
						$("select[name='country_code']").css("border","1px solid #f00");
						swal({
							title: "Country code is required!",
							icon: "warning"
						});
						window.scrollTo(0, 0);
						page = "step_3";

						$(".step_2").click();
						$(".btn_check").click();
					}else if(phone.length == 0){
						$("input[name='ship_phone']").css("border","1px solid #f00");
						swal({
							title: "Phone number is required!",
							icon: "warning"
						});
						window.scrollTo(0, 0);
						page = "step_3";

						$(".step_2").click();
						$(".btn_check").click();
					}else{

						var complete_phone = ccode+phone+"";//stringify

						$.ajax({
							url:   base_url+"phone_verify.php",
							data: {
								phone 	: complete_phone,
								user_id	: window.localStorage.getItem('id')
							},
							type: 'GET',
							dataType: 'html',
							beforeSend: function(xhr){
								swal({
									title: 'Verifying Phone Number',
									text: "Please wait..",
									buttons: false,
									html: true
								});
							},
							success: function(response){
								response = $.parseJSON(response);
								if(response.verified == "true"){
									swal.close();
									phone_is_verified = true;
									$(".step_3").click();
								}else{
									swal({
										title: response.title,
										text: "",
										content: {
									    element: "input",
									    attributes: {
									      placeholder: response.text,
									      type: "number",
									    },
									  },
										button: {
											text: "Verify",
											closeModal: false,
										},
									}).then(code => {

										if(code != null){
											$.get(base_url+"phone_validate.php?phone="+complete_phone+"&code="+code,function(data){
												data = $.parseJSON(data);

												if(data.verified == "true" || data.verified == true){
													swal({
														icon: "success",
														timer: 3000,
														buttons: false,
													}).then(code => {
														phone_is_verified = true;
														$(".step_3").click();
													});

													get_profile(window.localStorage.getItem("id"));
												}else{
													swal({
														title: "Invalid verification code!",
														icon: "warning"
													});

													get_profile(window.localStorage.getItem("id"));
												}
											});
										}else{
											swal({
												title: "Please enter verification code!",
												icon: "warning"
											});
										}

									});
								}
							},error:function(){
								swal({
									title: "Please check your internet connection",
									icon: "error"
								});
							}
						});
					}
				}
			}


			function phone_verify_profile(complete_phone){
				$.ajax({
					url:   base_url+"phone_verify.php",
					data: {
						phone 	: complete_phone,
						user_id	: window.localStorage.getItem('id')
					},
					type: 'GET',
					dataType: 'html',
					beforeSend: function(xhr){
						swal({
							title: 'Verifying Phone Number',
							text: "Please wait..",
							buttons: false,
							html: true
						});
					},
					success: function(response){
						response = $.parseJSON(response);
						if(response.verified == "true"){
							swal({
								icon: "success",
								timer: 3000,
								buttons: false,
							});
						}else{
							swal({
								title: response.title,
								text: "",
								content: {
									element: "input",
									attributes: {
										placeholder: response.text,
										type: "number",
									},
								},
								button: {
									text: "Verify",
									closeModal: false,
								},
							}).then(code => {
								if(code != null){
									$.get(base_url+"phone_validate.php?phone="+complete_phone+"&code="+code,function(data){
										data = $.parseJSON(data);
										if(data.verified == "true" || data.verified == true){
											swal({
												icon: "success",
												timer: 3000,
												buttons: false,
											}).then(code => {
											});
											get_profile(window.localStorage.getItem("id"));
										}else{
											swal({
												title: "Invalid verification code!",
												icon: "warning"
											});
											get_profile(window.localStorage.getItem("id"));
										}
									});
								}else{
									swal({
										title: "Please enter verification code!",
										icon: "warning"
									});
								}
							});
						}
					},error:function(){
						swal({
							title: "Please check your internet connection",
							icon: "error"
						});
					}
				});
			}

			$(".btn_drawer").click(function(){
				$(".popup-half").removeClass('active');
				$(".popup-full-custom").removeClass('active');
				color_categories();
			});

			$(".btn_back").click(function(){
				go_back();
			});

			//designing design options
			$(".btn_undo").click(function(){

					if(design_history.length > 0){
						var undo = design_history.pop();
						design[undo.key] = undo.value;
					}else{
						design = {};
						swal({
							title: "Sketch board is empty!",
							text: "You can only undo if you sketch something",
							icon: "info"
						});
					}
					render_image(design);
			});
			$(".btn_delete").on("click",function(){
				swal({
				  title: "Are you sure, you want to start over?",
				  text: "You will not be able to recover this sketch!",
				  icon: "warning",
				  buttons: true,
				  dangerMode: true,
				}).then((willDelete) => {
				  if (willDelete) {
						design = {};
						design_history = [];

						render_image(design);
						$(".design_sketch").hide();
						$(".design_sketch_empty").fadeIn("slow");
				  } else {
				    swal.close();
				  }
				});
			});
			$(".btn_invite").click(function(){
				var options = {
					message: 'Check out Myde Abaya, I use it to design and order abaya.',
					subject: 'Myde Abaya',
					//files: [res.URI], //filePath
					url: 'https://play.google.com/store/apps/details?id=com.vmi.mydeabaya',
					chooserTitle: 'Pick an app to share',
					//appPackageName: ''
				};
				var onSuccess = function(result) {
					//console.log("Share completed? " + result.completed); // On Android apps mostly return false even while it's true
					//console.log("Shared to app: " + result.app); // On Android result.app since plugin version 5.4.0 this is no longer empty. On iOS it's empty when sharing is cancelled (result.completed=false)
				};
				var onError = function(msg) {
					//console.log("Sharing failed with message: " + msg);
				};
				window.plugins.socialsharing.shareWithOptions(options, onSuccess, onError);
			});

			$(".btn_feedback").click(function(){
				var ref = cordova.InAppBrowser.open(base_url+'feedback.php', '', 'location=yes');
			});

			$(document).delegate(".btn_order_details","click",function(){
				//var tracking_id = $(this).attr("tracking_id");
				//var ref = cordova.InAppBrowser.open(base_web+'receipt.php?id='+tracking_id,'','location=yes');
				//window.open(base_web+'receipt.php?id='+tracking_id);

			});

			$(document).delegate(".btn_confirm_received","click",function(){
				var tracking_id = $(this).attr("tracking_id");
				swal({
					title: "Please wait..",
				});
				$.get(base_url+'confirm.php?tracking_id='+tracking_id,function(){
					swal({
						title: "Thankyou!",
						icon: "success",
						timer: 3000,
						buttons: false,
					});

					var id       = window.localStorage.getItem('id');
					get_orders(id);

				});
			});



			$(".btn_help").click(function(){
				var ref = cordova.InAppBrowser.open(base_url+'help.php', '', 'location=yes');
			});




			$(".btn_share").click(function(){
				$(".design_sketch").addClass("zoom_div");
				$(".zoom_div_close").fadeIn();

				setTimeout(function(){
					navigator.screenshot.URI(function(error,res){

						$(".design_sketch").removeClass("zoom_div");
						$(".zoom_div_close").fadeIn();

					  if(error){
							swal({
								title: "Unable to share..",
								text: error,
								icon: "error"
							});
					  }else{
							//now share
							swal.close();
							var options = {
								message: 'Check out my design, I use Myde Abaya to design and order abaya.',
								subject: 'Myde Abaya',
							  files: [res.URI], //filePath
							  url: 'https://play.google.com/store/apps/details?id=com.vmi.mydeabaya',
							  chooserTitle: 'Pick an app to share',
							  //appPackageName: ''
							};
							var onSuccess = function(result) {
							  //console.log("Share completed? " + result.completed); // On Android apps mostly return false even while it's true
							  //console.log("Shared to app: " + result.app); // On Android result.app since plugin version 5.4.0 this is no longer empty. On iOS it's empty when sharing is cancelled (result.completed=false)
							};
							var onError = function(msg) {
							  //console.log("Sharing failed with message: " + msg);
							};
							window.plugins.socialsharing.shareWithOptions(options, onSuccess, onError);
					  }
					});
				},500);
			});

			$(".btn_save").click(function(){
				$(".design_sketch").addClass("zoom_div");
				$(".zoom_div_close").fadeIn();

				setTimeout(function(){
					navigator.screenshot.save(function(error,res){
						$(".design_sketch").removeClass("zoom_div");
						$(".zoom_div_close").fadeIn();

						if(error){
							swal({
								title: "Failed",
								text: error,
								icon: "error"
							});
						}else{
							swal({
								title: "Saved in gallery!",
								text: "File Saved In Gallery: "+res.filePath,
								icon: "success",
								timer: 3000,
								buttons: false,
							});
						}
					});
				},500);
			});

			//close popups
			$(".design_sketch, .btn_load_fabric, .btn_load_size, .btn_load_width, .btn_load_sleeve, .btn_load_neckline, .btn_load_closing, .btn_load_pocket, .btn_load_pocket, .btn_load_belt, .btn_load_pleats, .btn_load_edges, .btn_load_crystal, .btn_load_embroidery, .btn_load_custom").on('click', function() {
					var data_popup = $(this).attr("data-popup");
					if(data_popup == undefined){
							$(".popup-half").removeClass('active');//close all on click -> .design_sketch
							color_categories();
					}else{
							$(".popup-half").not(data_popup).removeClass('active');//close all others but no this
							color_categories();
							$(this).css("background-color","#333");
					}
			});

			$("#reviewForm").submit(function(e){
				e.preventDefault();
				$(".sub_tab_review").hide();
				$(".sub_tab_shipping").fadeIn("slow");
				page = "shipping";
				window.scrollTo(0, 0);
			});

			$(document).delegate(".action1","click",function(){
				$(".popup-share").addClass('active');
				$(".popup-share").fadeIn("slow");
			});

			// $(".btn_blog").on("click",function(){
			// 	$('#landing_page').hide();
			// 	$(".popup-social").fadeIn();

			// });

			$(document).delegate(".btn-small-round","click",function(){
				$(".btn-small-round-active").removeClass("btn-small-round-active");
				$(this).addClass("btn-small-round-active");
			});

			$(document).delegate(".btn-small-round-size","click",function(){
				$(".btn-small-round-size-active").removeClass("btn-small-round-size-active");
				$(this).addClass("btn-small-round-size-active");
			});

			$(".btn_review").click(function(){
				$(".sub_tab_shipping").hide();
				$(".sub_tab_review").fadeIn("slow");
				window.scrollTo(0, 0);
			});



			$(".btn_payment").click(function(e){
				//save address for next time
				var login_id 			= window.localStorage.getItem("id");
				var address_data 	= $("#shippingAddressForm").serializeArray();
				window.localStorage.setItem("address_"+login_id,JSON.stringify(address_data));
				$(".step_3").click();
			});

			$("#paymentForm").submit(function(e){
				e.preventDefault();
				$(".sub_tab_payment").hide();
				$(".sub_tab_payment_review").fadeIn("slow");

				//1
				var address_str_1 = [];
				address_str_1.push($("input[name='ship_address']").val());
				address_str_1.push($("select[name='regions']").children("option:selected").text());
				address_str_1.push($("select[name='districts']").children("option:selected").text());
				address_str_1.push($("select[name='townships']").children("option:selected").text());
				address_str_1.push($("input[name='zip_code']").val());


				//2
				var address_str_2 = [];
				address_str_1.push($("input[name='ship_address_2']").val());
				address_str_2.push($("select[name='regions_2']").children("option:selected").text());
				address_str_2.push($("select[name='districts_2']").children("option:selected").text());
				address_str_2.push($("select[name='townships_2']").children("option:selected").text());
				address_str_2.push($("input[name='zip_code_2']").val());

				$(".confirm_shiping_address1").html(address_str_1.join(", "));

				if($("#same_billing_address").prop("checked")){
					$(".confirm_shiping_address2").hide();
				}else{
					$(".confirm_shiping_address2").html(address_str_2.join(", ")).show();
				}

				$(".confirm_contact").text($("input[name='ship_phone']").val());

				page = "payment";
				window.scrollTo(0, 0);
			});

			$("input[name='payment']").change(function(){
				if($(this).val() == "Credit Card"){
					$(".card_details").fadeIn("slow");
				}else{
					$(".card_details").hide()
				}
			});


			$("#same_billing_address").change(function(){
				if($(this).prop("checked") == true){
					$(".billing_address").hide();
				}else{
					$(".billing_address").fadeIn("slow");
					var objDiv = document.getElementById("billing_address");
					objDiv.scrollTop = objDiv.scrollHeight;
				}
			});

			$(".btn_my_account").click(function(){
				//my_profile
				/*swal({
					title: 'Getting account info..',
					text: "Please wait",
					buttons: false,
					html: true
				});*/

				$("#my_profile").fadeIn("slow");
				$("#order_success_page").hide();
				$("#my_orders").hide();
				$("#designing_page").hide();
				$(".btn_in_process").click();
				page = "my_orders";
				window.scrollTo(0, 0);

				$(".panel-right, .panel-overlay").removeClass("active");
				$(".with-panel-right-reveal").removeClass("with-panel-right-reveal");
				$(".panel-overlay").removeAttr("style");
			});

			$(".btn_order_in_process").click(function(){

				$("#my_profile").hide();
				$("#order_success_page").hide();
				$("#my_orders").fadeIn("slow");
				$("#designing_page").hide();
				$(".btn_in_process").click();
				page = "my_orders";
				window.scrollTo(0, 0);

				$(".panel-right, .panel-overlay").removeClass("active");
				$(".with-panel-right-reveal").removeClass("with-panel-right-reveal");
				$(".panel-overlay").removeAttr("style");
			});

			function render_image(design){

				//design in local storage with login ID
				var login_id 			= window.localStorage.getItem("id");
				var draft_design 	= JSON.stringify(design);
				window.localStorage.setItem("design_"+login_id,draft_design);

				var sketch_images = [];
				$.each(design,function(key, value){
					value = value-1;//beucase array starts with 0
					if(key == "width"){
						try{
							sketch_images.push(width_json[value].image);
						}catch(e){
							width_json = window.localStorage.getItem("width_json");
							width_json = $.parseJSON(width_json);
							sketch_images.push(width_json[value].image);
						}
					}else if(key == "sleeve"){
						try{
							sketch_images.push(sleeve_json[value].image);
						}catch(e){
							sleeve_json = window.localStorage.getItem("sleeve_json");
							sleeve_json = $.parseJSON(sleeve_json);
							sketch_images.push(sleeve_json[value].image);
						}
					}else if(key == "neckline"){
						try{
							sketch_images.push(neckline_json[value].image);
						}catch(e){
							neckline_json = window.localStorage.getItem("neckline_json");
							neckline_json = $.parseJSON(neckline_json);
							sketch_images.push(neckline_json[value].image);
						}
					}else if(key == "closing"){
						try{
							sketch_images.push(closing_json[value].image);
						}catch(e){
							closing_json = window.localStorage.getItem("closing_json");
							closing_json = $.parseJSON(closing_json);
							sketch_images.push(closing_json[value].image);
						}
					}else if(key == "pocket"){
						try{
							sketch_images.push(pocket_json[value].image);
						}catch(e){
							pocket_json = window.localStorage.getItem("pocket_json");
							pocket_json = $.parseJSON(pocket_json);
							sketch_images.push(pocket_json[value].image);
						}
					}else if(key == "belt"){
						try{
							sketch_images.push(belt_json[value].image);
						}catch(e){
							belt_json = window.localStorage.getItem("belt_json");
							belt_json = $.parseJSON(belt_json);
							sketch_images.push(belt_json[value].image);
						}
					}else if(key == "pleats"){
						try{
							sketch_images.push(pleats_json[value].image);
						}catch(e){
							pleats_json = window.localStorage.getItem("pleats_json");
							pleats_json = $.parseJSON(pleats_json);
							sketch_images.push(pleats_json[value].image);
						}
					}else if(key == "edges"){
						try{
							sketch_images.push(edges_json[value].image);
						}catch(e){
							edges_json = window.localStorage.getItem("edges_json");
							edges_json = $.parseJSON(edges_json);
							sketch_images.push(edges_json[value].image);
						}
					}
				});
				var sketch_images_str = "url(images/abaya/body.png),";
				for(var i=0; i<sketch_images.length; i++){
					sketch_images_str += "url('"+sketch_images[i]+"'),";
				}
				sketch_images_str = sketch_images_str.substr(0,sketch_images_str.length-1);
				$(".design_sketch, .finished_design").css("background-image",sketch_images_str);
				$(".design_sketch").fadeIn("slow");
				$(".design_sketch_empty").hide();

				//height and width for perfect visibility
				$(".design_sketch").css("background-size",$(window).width()+"px");
				if(($(window).height()/2) < 300){
					$(".design_sketch").css("min-height",(300)+"px");
				}else{
					$(".design_sketch").css("min-height",($(window).height()/2)+"px");
				}


				var max_width = 1024;
				var min_width = 320;
				var max_size	= 215;
				var min_size	= 70;

				var current_width = $(window).width();

				var percentage = ((current_width)*100)/(max_width);

				var actual_size = (max_size/100)*percentage;

				$(".design_sketch").css("background-position","-"+(actual_size)+"px -20px");


			}

			//getting elements and fitting in divs/buttons
			function append_items(elem,new_json,selection_class){
				var count_interation	= 0;
				var json_length				= new_json.length;

				var process_delay 		= 100;

				if(json_length == 0){ //no items
					$(elem).empty();
					$(elem).append('<div class="err_no_items">Sorry, no items in this category!</div>');
				}else{
					//default
					$(elem).html('<button class="'+selection_class+' btn-small-round btn-small-round-active">'+
											'<div style="background-image:url(images/abaya/default.png)" class="btn_img_default"></div>'+
											'<br>'+
											'<span class="name">None</span>'+
											 '</button>');

					//load 4 at a time
					$(new_json).each(function(key,value){
						count_interation++;

						var id 						= value.id;
						var name 					= value.name;
						if(name.length > 10){name = name.substr(0,10)+"...";}
						var image 				= value.image;
						var price					= value.price;
						var count					= value.count;

						var active_class 	= ""; /**/

						if(count != "" && count > 0){
							var show_count = '<kbd>'+count+' sold</kbd>';
						}else{
							var show_count = '';
						}

						if(price <= 0 || price == ""){var	show = "Free";}else{var show = price+" SAR";}

						//console.log(count_interation);
						$(elem).append('<button  item_id="'+id+'" class="'+selection_class+' btn-small-round '+active_class+'">'+
												'<div style="background-image:url('+image+')" class="btn_img"></div>'+
												'<br>'+
												'<span class="name">'+name+'</span>'+
												 '<span class="sleeve_price">'+show+'</span>'+
												 show_count+
												 '</button>');
						if(count_interation >= 4){return false;}
					});

					if(json_length > 4){
						var my_interval = setInterval(function(){
								count_interation++;
								var index = count_interation-1;

								var id 						= new_json[index].id;
								var name 					= new_json[index].name;
								if(name.length > 10){name = name.substr(0,10)+"...";}
								var image 				= new_json[index].image;
								var price					= new_json[index].price;

								var active_class 	= ""; /*btn-small-round-active*/

								if(count_interation > 1){
										var active_class = "";
								}

								if(price <= 0 || price == ""){
									var	show = "Free";
								}else{
									var show = price+" SAR";
								}
								//console.log(count_interation);
								$(elem).append('<button  item_id="'+id+'" class="'+selection_class+' btn-small-round '+active_class+'">'+
														'<div style="background-image:url('+image+')" class="btn_img"></div>'+
														'<br>'+
														'<span class="name">'+name+'</span>'+
														 '<span class="sleeve_price">'+show+'</span>'+
														 '</button>');

								if(count_interation == new_json.length){
										clearInterval(my_interval);
								}
						},process_delay);
					}
				}
			}

			function get_fabric(){
				if($(".fabric_here button").length == 0){
					$(".fabric_here").html("<img class='loader_center' src='images/loader.gif' alt=''/>");
					$.get(base_url+"index.php?type=fabric",function(data){
						window.localStorage.setItem("fabric_json",data);
						fabric_json = $.parseJSON(data);
						var selection_class = "select_fabric";
						append_items($(".fabric_here"),fabric_json,selection_class);
					});
				}
			}
			function get_size(){
				if($(".size_here button").length == 0){
					$(".size_here").html("<img class='loader_center' src='images/loader.gif' alt=''/>");
					$.get(base_url+"index.php?type=size",function(data){
						window.localStorage.setItem("size_json",data);
						size_json = $.parseJSON(data);
						var sno = 1;
						$(".size_here").html('<button class="select_size btn-small-round-size btn_size btn-small-round-size-active">'+
													'<span class="size_name">None</span><br>'+
												'</button>');

						$.each(size_json, function(key, value) {
							var id 		= value.id;
							var name 	= value.name;
							var price	= value.price;
							if(sno == 1){
								var active_class = "" /*btn-small-round-size-active*/;
							}else{
								var active_class = "";
							}
							if(price <= 0 || price == ""){
							 	var	show = "";
							}else{
								var show = price+" SAR";
							}
							$(".size_here").append('<button item_id="'+id+'" class="select_size btn-small-round-size btn_size '+active_class+'">'+
														'<span class="size_name">'+name+'</span><br>'+
														'<span class="size_price">'+show+'</span>'+
													'</button>');
							sno++;
						});
						if(sno<=1){
							$(".size_here").append('<div class="err_no_items">Sorry, no items in this category!</div>');
						}
					});
				}
			}
			function get_width(){
				if($(".width_here button").length == 0){
					$(".width_here").html("<img class='loader_center' src='images/loader.gif' alt=''/>");
						$.get(base_url+"index.php?type=width",function(data){
							window.localStorage.setItem("width_json",data);
							width_json = $.parseJSON(data);
							var selection_class = "select_width";
							append_items($(".width_here"),width_json,selection_class);
						});
				}
			}

			function get_sleeve(){
				if($(".sleeve_here button").length == 0){
						$(".sleeve_here").html("<img class='loader_center' src='images/loader.gif' alt=''/>");
						$.get(base_url+"index.php?type=sleeve",function(data){
							window.localStorage.setItem("sleeve_json",data);
							sleeve_json = $.parseJSON(data);
							var selection_class = "select_sleeve";
							append_items($(".sleeve_here"),sleeve_json,selection_class);
						});
				}
			}
			function get_neckline(){
				if($(".neckline_here button").length == 0){
					$(".neckline_here").html("<img class='loader_center' src='images/loader.gif' alt=''/>");
						$.get(base_url+"index.php?type=neckline",function(data){
							window.localStorage.setItem("neckline_json",data);
							neckline_json = $.parseJSON(data);
							var selection_class = "select_neckline";
							append_items($(".neckline_here"),neckline_json,selection_class);
						});
				}
			}
			function get_closing(){
					if($(".closing_here button").length == 0){
						$(".closing_here").html("<img class='loader_center' src='images/loader.gif' alt=''/>");
						$.get(base_url+"index.php?type=closing",function(data){
							window.localStorage.setItem("closing_json",data);
							closing_json = $.parseJSON(data);
							var selection_class = "select_closing";
							append_items($(".closing_here"),closing_json,selection_class);
						});
					}
			}
			function get_pocket(){
				if($(".pocket_here button").length == 0){
					$(".pocket_here").html("<img class='loader_center' src='images/loader.gif' alt=''/>");
						$.get(base_url+"index.php?type=pocket",function(data){
							window.localStorage.setItem("pocket_json",data);
							pocket_json = $.parseJSON(data);
							var selection_class = "select_pocket";
							append_items($(".pocket_here"),pocket_json,selection_class);
						});
				}
			}
			function get_belt(){
			 if($(".belt_here button").length == 0){
				 	$(".belt_here").html("<img class='loader_center' src='images/loader.gif' alt=''/>");
					$.get(base_url+"index.php?type=belt",function(data){
						window.localStorage.setItem("belt_json",data);
						belt_json = $.parseJSON(data);
						var selection_class = "select_belt";
						append_items($(".belt_here"),belt_json,selection_class);
					});
				}
		 }
		 function get_pleats(){
			 if($(".pleats_here button").length == 0){
				 $(".pleats_here").html("<img class='loader_center' src='images/loader.gif' alt=''/>");
					 $.get(base_url+"index.php?type=pleats",function(data){
						  window.localStorage.setItem("pleats_json",data);
						 	pleats_json = $.parseJSON(data);
							var selection_class = "select_pleats";
 							append_items($(".pleats_here"),pleats_json,selection_class);
					 });
				 }
		 }
		 function get_edges(){
			 if($(".edges_here button").length == 0){
				 	$(".edges_here").html("<img class='loader_center' src='images/loader.gif' alt=''/>");
					 $.get(base_url+"index.php?type=edges",function(data){
						 window.localStorage.setItem("edges_json",data);
						 edges_json = $.parseJSON(data);
						 var selection_class = "select_edges";
						 append_items($(".edges_here"),edges_json,selection_class);
					 });
				 }
		 }
		 function get_crystal(){
	 		if($(".crystal_here button").length == 0){
	 			$(".crystal_here").html("<img class='loader_center' src='images/loader.gif' alt=''/>");
	 				$.get(base_url+"index.php?type=crystal",function(data){
						window.localStorage.setItem("crystal_json",data);
						crystal_json = $.parseJSON(data);
						var selection_class = "select_crystal";
						append_items($(".crystal_here"),crystal_json,selection_class);
					});
				}
	 		}
	 		function get_embroidery(){
	 				if($(".embroidery_here button").length == 0){
	 					$(".embroidery_here").html("<img class='loader_center' src='images/loader.gif' alt=''/>");
	 					$.get(base_url+"index.php?type=embroidery",function(data){
							window.localStorage.setItem("embroidery_json",data);
							embroidery_json = $.parseJSON(data);
							var selection_class = "select_embroidery";
							append_items($(".embroidery_here"),embroidery_json,selection_class);
						});
					}
	 		}

			$(document).delegate(".select_fabric","click",function(){
				var item_id = $(this).attr("item_id");
				if(item_id == undefined){
					delete design.fabric;
				}else{
					design.fabric = item_id;
				}
				render_image(design);
			});
			$(document).delegate(".select_size","click",function(){
				var item_id = $(this).attr("item_id");
				if(item_id == undefined){
					delete design.size;
				}else{
					design.size = item_id;
				}
				render_image(design);
			});
			$(document).delegate(".select_width","click",function(){
				var item_id = $(this).attr("item_id");
				if(item_id == undefined){
					delete design.width;
				}else{
					design.width = item_id;
					design_history.push({key:"width",value:item_id}); //for btn_undo
				}
				render_image(design);
			});
			$(document).delegate(".select_sleeve","click",function(){
				var item_id = $(this).attr("item_id");
				if(item_id == undefined){
					delete design.sleeve;
				}else{
					design.sleeve = item_id;
					design_history.push({key:"sleeve",value:item_id}); //for btn_undo
				}
				render_image(design);
			});
			$(document).delegate(".select_neckline","click",function(){
				var item_id = $(this).attr("item_id");
				if(item_id == undefined){
					delete design.neckline;
				}else{
					design.neckline = item_id;
					design_history.push({key:"neckline",value:item_id}); //for btn_undo
				}
				render_image(design);
			});
			$(document).delegate(".select_closing","click",function(){
				var item_id = $(this).attr("item_id");
				if(item_id == undefined){
					delete design.closing;
				}else{
					design.closing = item_id;
					design_history.push({key:"closing",value:item_id}); //for btn_undo
				}
				render_image(design);
			});
			$(document).delegate(".select_pocket","click",function(){
				var item_id = $(this).attr("item_id");
				if(item_id == undefined){
					delete design.pocket;
				}else{
					design.pocket = item_id;
					design_history.push({key:"pocket",value:item_id}); //for btn_undo
				}
				render_image(design);
			});
			$(document).delegate(".select_belt","click",function(){
				var item_id = $(this).attr("item_id");
				if(item_id == undefined){
					delete design.belt;
				}else{
					design.belt = item_id;
					design_history.push({key:"belt",value:item_id}); //for btn_undo
				}
				render_image(design);
			});
			$(document).delegate(".select_pleats","click",function(){
				var item_id = $(this).attr("item_id");
				if(item_id == undefined){
					delete design.pleats;
				}else{
					design.pleats = item_id;
					design_history.push({key:"pleats",value:item_id}); //for btn_undo
				}
				render_image(design);
			});
			$(document).delegate(".select_edges","click",function(){
				var item_id = $(this).attr("item_id");
				if(item_id == undefined){
					delete design.edges;
				}else{
					design.edges = item_id;
					design_history.push({key:"edges",value:item_id}); //for btn_undo
				}
				render_image(design);
			});
			$(document).delegate(".select_crystal","click",function(){
				var item_id = $(this).attr("item_id");
				if(item_id == undefined){
					delete design.crystal;
				}else{
					design.crystal = item_id;
				}
				render_image(design);
			});
			$(document).delegate(".select_embroidery","click",function(){
				var item_id = $(this).attr("item_id");
				if(item_id == undefined){
					delete design.embroidery;
				}else{
					design.embroidery = item_id;
				}
				render_image(design);
			});

			//loading events
			$(".btn_load_fabric").click(function(){
				get_fabric();
			});
			$(".btn_load_size").click(function(){
				get_size();
			});
			$(".btn_load_width").click(function(){
				get_width();
			});
			$(".btn_load_sleeve").click(function(){
				get_sleeve();
			});
			$(".btn_load_neckline").click(function(){
				get_neckline();
			});
			$(".btn_load_closing").click(function(){
				get_closing();
			});
			$(".btn_load_pocket").click(function(){
				get_pocket();
			});
			$(".btn_load_belt").click(function(){
				get_belt();
			});
			$(".btn_load_pleats").click(function(){
				get_pleats();
			});
			$(".btn_load_edges").click(function(){
				get_edges();
			});
			$(".btn_load_crystal").click(function(){
				get_crystal();
			});
			$(".btn_load_embroidery").click(function(){
				get_embroidery();
			});



			//blog
			function get_blog(){
				if($(".blog_here button").length == 0){
					$(".blog_here").html("<img class='loader_center' src='images/loader.gif' alt=''/>");

						$.get(base_url+"index.php?type=blog",function(data){
							data = $.parseJSON(data);
							var id = 0;
							var sno = 1;
							$(".blog_here").empty();
							$.each(data, function(key, value) {
								var id 		= value.id;
								var name 	= value.name;
								var image 	= value.image;
								var message	= value.message;
								if(sno == 1){
									var active_class = ""; /*btn-small-round-active*/
								}else{
									var active_class = "";
								}
								$(".blog_here").append('<div class="page_single layout_fullwidth_padding">'+
														'<ul class="posts" ' +active_class+'>'+
														   '<li class="swipeout">'+
															  '<div class="swiper-wrapper">'+
																 '<div class="swiper-slide swipeout-content item-content">'+
																	'<div class="post_entry">'+
																	   '<div class="post_thumb"><img src="'+image+'" alt="" title="" /></div>'+
																	   '<div class="post_details">'+
																		  '<div class="post_category"><a href="javascript:;">' +name+ '</a></div>'+
																		  '<h2><a href="javascript:;">'+message+'</a></h2>'+
																	   '</div>'+
																	   '<div class="post_swipe"><img src="images/swipe_more.png" alt="" title="" /></div>'+
																	'</div>'+
																 '</div>'+
																 '<div class="swiper-slide swipeout-actions-right">'+
																	'<a href="javascript:;" class="action1 open-popup" data-popup=".popup-share"><img src="images/icons/white/message.png" alt="" title="" /></a>'+
																	'<a href="javascript:;" class="action1 open-popup" data-popup=".popup-share"><img src="images/icons/white/like.png" alt="" title="" /></a>'+
																	'<a href="javascript:;" class="action1 open-popup" data-popup=".popup-share"><img src="images/icons/white/contact.png" alt="" title="" /></a>'+
																 '</div>'+
															  '</div>'+
														   '</li>'+
														 '</ul>'+
														'</div>');

								sno++;

							});
								if(sno<=1){
									$(".blog_here").append("<div class='info_no_items'>We're really writing awesome blogs for you!</div>");
								}
						});
				}
			}

			get_blog();


			color_categories();


			$("#customload").on('submit',(function(e) {
						e.preventDefault();


					  $.ajax({
					   url: base_url+"custom_order.php",
					   type: "POST",
					   data:  new FormData(this),
					   contentType: false,
					   cache: false,
					   processData:false,
					   beforeSend : function(){
							 swal({
 								title: 'Please wait..',
 								text: "We're sending you order",
 								buttons: false,
 								html: true
 							});
					   },
					   success: function(data){
							 console.log(data);

							 $("input[name='image[]'], textarea[name='contact_comment']").val("");

			 					swal({
			 						title: "Order Sent!",
			 						text: "Thank you for your order!",
			 						icon: "success",
			 						timer: 3000,
			 						buttons: false,
			 					});
					   },
					   error: function(e){

					   }
					 });
			}));


			$("form.form_forgot").submit(function(e){

				$.ajax({
					url:   base_url+"reset_password.php",
					data: {
						email 	: $(".reset_email").val(),
					},
					type: 'GET',
					dataType: 'html',
					beforeSend: function(xhr){
						swal({
							title: 'Please wait..',
							text: "We're sending you reset link",
							buttons: false,
							html: true
						});
					},
					success: function(response){
						response = $.parseJSON(response);

						if(response.success == true){
							swal({
								title: response.title,
								text: response.text,
								icon: "success",
								timer: 3000,
								buttons: false,
							});
						}else{
							swal({
								title: response.title,
								text: response.text,
								icon: "error"
							});
						}

					},error:function(){
						swal({
							title: "Please check your internet connection",
							icon: "error"
						});
					}
				});

				e.preventDefault();

			});

			$("form.form_signup").submit(function(e){

				var fullname 	= $(".signup_fullname").val();
				var email 		= $(".signup_email").val();
				var password 	= $(".signup_password").val();
				var password2	= $(".signup_password2").val();

				if(fullname.length == 0){
					swal({
						text: "Name is required!",
						icon: "warning"
					});
				}else if(email.length == 0){
					swal({
						title: "Email is required!",
						icon: "warning"
					});
				}else if(password.length == 0){
					swal({
						title: "Password is required!",
						icon: "warning"
					});
				}/*else if(validateEmail(email) == false){
					swal({
						title: "Please enter a valid email!",
						icon: "warning"
					});
				}*/else if(password != password2){
					swal({
						title: "Password didn't match!",
						icon: "warning"
					});
				}else{

					$.ajax({
						url:   base_url+"auth.php",
						data: {
							fullname 	: fullname,
							email 		: email,
							password 	: password,
							type			: "signup"
						},
						type: 'GET',
						dataType: 'html',
						beforeSend: function(xhr){
							swal({
								title: 'Please wait..',
								text: "We're creating your account",
								closeOnClickOutside: false,
								buttons: false,
								html: true
							});
						},
						success: function(response){
							response = $.parseJSON(response);

							if(response.success == true){
								swal({
									title: response.title,
									text: response.text,
									icon: "success",
									timer: 3000,
									buttons: false,
								}).then((value) => {
									$(".popup-signup").removeClass("active");
									$(".popup-login").addClass("active");
								});
							}else{
								swal({
									title: response.title,
									text: response.text,
									icon: "error"
								});
							}

						},error:function(){
							swal({
								title: "Please check your internet connection",
								icon: "error"
							});
						}
					});
				}
				e.preventDefault();
			});

			$("form.form_login").submit(function(e){
				var email 		= $(".login_email").val();
				var password	= $(".login_password").val();

				if(email.length == 0){
					swal({
						title: "Email is required!",
						icon: "warning"
					});
				}else if(password.length == 0){
					swal({
						title: "Password is required!",
						icon: "warning"
					});
				}else{
					$.ajax({
						url:   base_url+"auth.php",
						data: {
							email 		: email,
							password 	: password,
							type			: "signin"
						},
						type: 'GET',
						dataType: 'html',
						beforeSend: function(xhr){
							swal({
								title: 'Please wait..',
								text: "We're signing in your account",
								closeOnClickOutside: false,
								buttons: false,
								html: true
							});
						},
						success: function(response){
							response = $.parseJSON(response);
							if(response.success == true){
								swal({
									title: response.title,
									text: response.text,
									icon: "success",
									timer: 3000,
									buttons: false
								}).then((value) => {
									window.localStorage.setItem('id',response.id);
									window.localStorage.setItem('name',response.name);
									window.localStorage.setItem('email',response.email);
									window.localStorage.setItem('pass',response.pass);
									window.localStorage.setItem('valid_device', "true");
									window.localStorage.setItem('csrf_token', response.csrf_token);
									$(".popup-login").removeClass("active");
									$(".btn_get_started").click();
									auto_login();
								});
							}else{
								swal({
									title: response.title,
									text: response.text,
									icon: "error"
								});
								window.localStorage.setItem('id','null');
								window.localStorage.setItem('valid_device', "false");
								window.localStorage.setItem('csrf_token', null);
							}
						},error:function(){
							swal({
								title: "Please check your internet connection",
								icon: "error"
							});
						}
					});
				}
				e.preventDefault();
			});

			$(".btn_logout_opt").click(function(){
				swal({
					title: "Please login",
					text: "Join Myde Abaya to get started!",
					icon: "warning"
				}).then((value) => {

					$(".popup-login").addClass('active');

				});
			});

				function auto_login(){

						$(".btn_login_opt").show();
						$(".btn_logout_opt").hide();

						var id       = window.localStorage.getItem('id');
						var username = window.localStorage.getItem('name');
						var email 	 = window.localStorage.getItem('email');
						var password = window.localStorage.getItem('pass');

						get_profile(id);

						get_orders(id);

						$(".contact_user_id").val(id);

						$(".username_val").val(username);
						$(".useremail_val").val(email);

						$(".username").html(username);
						$(".ship_uname").val(username);
						$(".useremail").html(email);
						$(".ship_email").val(email);

						$("#landing_page").hide(0,function(){
							$("#designing_page").fadeIn("slow");

							$("#title_bar").hide();
							$("#title_bar").removeClass("hidden");
							$("#title_bar").fadeIn("slow");
						});

						//check draft_design
						var login_id 			= window.localStorage.getItem("id");
						var draft_design 	= window.localStorage.getItem("design_"+login_id);
						var name 					= window.localStorage.getItem("name");
						var swal_text 		= "Good to see you!";

						if(draft_design != undefined && draft_design != null && draft_design.length > 0){
							draft_design = $.parseJSON(draft_design);
							$.each(draft_design,function(k,v){
								design_history.push({key:k,value:v}); //for btn_undo
							});
							design = draft_design;//restore
							render_image(draft_design);
							swal_text = "Draft design restored, you can complete your previous saved design.";
						}

						var name = window.localStorage.getItem('name');
						swal({
							title: "Welcome, "+name+"!",
							text: swal_text,
							icon: "info",
							buttons: false,
							timer:3000,
						}).then((value) => {});


						get_fabric();
						get_size();
						get_width();
						get_sleeve();
						get_neckline();
						get_closing();




						var address_data 	= window.localStorage.getItem("address_"+login_id);
						address_data_obj	= $.parseJSON(address_data);
						$.each(address_data_obj, function(k,v){
							if(v.name == "regions" || v.name == "regions_2"){

							}else if(v.name == "districts" || v.name == "districts_2"){

							}else if(v.name == "townships" || v.name == "townships_2"){

							}else{
								$("[name='"+v.name+"']").val(v.value);
							}
						});
				}

				function get_profile(id){

					$.get(base_url+"account.php?id="+id+"&action=read",function(response){
						response = $.parseJSON(response);

						//profile
						$(".profile_username").val(response.username);
						$(".profile_phone").val(response.phone);
						$(".profile_email").val(response.email);
						$(".profile_signup").val(response.signup_at);

						//global
						$(".username").text(response.username);
						$(".useremail").text(response.email);


						if(response.email_verified == "true"){
							$(".email_verified").text("verified").removeClass("text-red").addClass("text-green").hide().fadeIn();
						}else{
							$(".email_verified").text("unverified").addClass("text-red").removeClass("text-green").hide().fadeIn();
						}
						if(response.phone_verified == "true"){
							$(".phone_verified").text("verified").removeClass("text-red").addClass("text-green").hide().fadeIn();
						}else{
							$(".phone_verified").text("unverified").addClass("text-red").removeClass("text-green").hide().fadeIn();
						}
					});

				}

				function get_orders(id){

					$.get(base_url+"my_orders.php?id="+id,function(response){
						response = $.parseJSON(response);

						$(".in_process").empty();
						$(".past_orders").empty();

						$(response).each(function(k,v){
							console.log(v);

							var url = base_web+'receipt.php?id='+v.tracking_id;

							if(v.status_tag != "received"){
								$(".in_process").append('<div class="accordion__item">'+
									'<input class="accordion__input" id="in_process_'+k+'" type="radio" name="accordion">'+
									'<label class="accordion__label" for="in_process_'+k+'">'+

									'<div class="my-col">'+
										'<div class="col-20">'+v.date_time+'</div>'+
										'<div class="col-60">Order # '+v.tracking_id+'</div>'+
										'<div class="col-20"><span></span></div>'+
										'<div class="clearfix"></div>'+
									'</div>'+

									'</label>'+
									'<div class="accordion__content">'+
										'<div class="carttotal_full">'+
												'<div class="carttotal_row_full">'+
												'<div class="carttotal_left"> <span class="order_status '+v.status_color+'">'+v.status_text+'</span></div>  <div class="carttotal_right"><a href="'+url+'" tracking_id="'+v.tracking_id+'" class="btn_order_details">View Details</a></div>'+
												'</div>'+
										'</div>'+
									'</div>'+
								'</div>');
							}else{

								var btn_confirm_received = "";

								if(v.status_tag == "shipped" || v.status_tag == "delivered"){
									btn_confirm_received = '<div class="carttotal_full">'+
											'<div><span tracking_id="'+v.tracking_id+'" class="btn_confirm_received"><i class="fa fa-check"></i> Confirm Received</span></div>'+
											'</div>'+
									'</div>';
								}

								$(".past_orders").append('<div class="accordion__item">'+
									'<input class="accordion__input" id="past_'+k+'" type="radio" name="accordion">'+
									'<label class="accordion__label" for="past_'+k+'">'+

									'<div class="my-col">'+
										'<div class="col-20">'+v.date_time+'</div>'+
										'<div class="col-60">Order # '+v.tracking_id+'</div>'+
										'<div class="col-20"><span></span></div>'+
										'<div class="clearfix"></div>'+
									'</div>'+

									'</label>'+
									'<div class="accordion__content">'+
										'<div class="carttotal_full">'+
												'<div class="carttotal_row_full">'+
												'<div class="carttotal_left"> <span class="order_status '+v.status_color+'">'+v.status_text+'</span></div>  <div class="carttotal_right"><a href="'+url+'" tracking_id="'+v.tracking_id+'" class="btn_order_details">View Details</a></div>'+
												'</div>'+
										'</div>'+
										btn_confirm_received+

									'</div>'+
								'</div>');
							}
						});


					});
				}



				$("#form_profile").submit(function(e){
					e.preventDefault();
					var id       = window.localStorage.getItem('id');

					var username 	= $(".profile_username").val();
					var phone 		= $(".profile_phone").val();
					var email 		= $(".profile_email").val();
					var valid_request = false;

					if(username.length == 0){
						swal({
							title: "Name is required",
							text: "Please enter your name",
							icon: "warning"
						});
					}else if(phone.length == 0){
						swal({
							title: "Phone is required",
							text: "Please enter your phone",
							icon: "warning"
						});
					}else if(email.length == 0){
						swal({
							title: "Email is required",
							text: "Please enter your email address",
							icon: "warning"
						});
					}else{
						valid_request = true;
					}

					if(valid_request == true){

						var profile_pass 					= $(".profile_pass").val();
						var profile_pass_new 			= $(".profile_pass_new").val();
						var profile_pass_new2 		= $(".profile_pass_new2").val();

						if(profile_pass_new.length > 0){//want to change password
							if(profile_pass_new != profile_pass_new2){
								swal({
									title: "Confirm password didn't matched!",
									icon: "warning"
								});
							}else{
								swal({
									title: "Saving Profile",
									//closeOnClickOutside: false,
									buttons: false,
									html: true
								});
								$.get(base_url+"account.php?id="+id+"&action=write&username="+username+"&email="+email+"&phone="+phone,function(response){
									response = $.parseJSON(response);
									if(response.success == "true"){
										if(response.text == ""){
											response.text = " ";
										}

										swal({
											title: response.title,
											text: response.text,
											icon: "success",
											timer: 3000,
											buttons: false,
										});

										get_profile(id);
									}else{
										swal({
											title: response.title,
											text: response.text,
											icon: "danger"
										});
									}
								});
							}
						}else{
							swal({
								title: "Saving Profile",
								text: "Updating profile details..",
								//closeOnClickOutside: false,
								buttons: false,
								html: true
							});
							$.get(base_url+"account.php?id="+id+"&action=write&username="+username+"&email="+email+"&phone="+phone+"&password="+profile_pass+"&new_password="+profile_pass_new,function(response){
								response = $.parseJSON(response);
								if(response.success == "true"){
									if(response.text == ""){
										response.text = " ";
									}
									swal({
										title: response.title,
										text: response.text,
										icon: "success",
										timer: 3000,
										buttons: false,
									});

									phone_verify_profile(phone);

									get_profile(id);
								}else{
									swal({
										title: response.title,
										text: response.text,
										icon: "danger"
									});
								}
							});
						}
					}
				});

				$(".btn_zoom").click(function(){
						$(".design_sketch").hide();
						$(".design_sketch").addClass("zoom_div");
						$(".zoom_div_close").fadeIn();
						$(".design_sketch").fadeIn("slow");

						/*
						swal({
							text: 'Please back button to go back',
							buttons: false,
							icon: "info",
							html: true
						});
						*/

				});

				$(".zoom_div_close").click(function(){
					$(".design_sketch").removeClass("zoom_div");
					$(".zoom_div_close").hide();
				});

/////////////// Checking if user signIn then place an order

				$(".btn_check").click(function(){
					$(".sub_tab_review").hide();
					$(".sub_tab_shipping").fadeIn(function(){
							window.scrollTo(0, 0);
					});
					page = "shipping";
				});

				function validateEmail($email) {
				  var emailReg = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
				  return emailReg.test( $email );
				}

				$(".open-popup[data-popup='.popup-signup']").click(function(e){
					$(".popup-login, .forgot_pass").removeClass("active");
				});

				$(".open-popup[data-popup='.popup-login']").click(function(e){
					$(".popup-signup, .forgot_pass").removeClass("active");
				});

				$(".logout").click(function(){
					swal({
					  title: "Are you sure, you want to logout?",
					  icon: "warning",
					  buttons: true,
					  dangerMode: true,
					}).then((willDelete) => {
					  if (willDelete) {
							window.localStorage.clear('valid_device', "false");

							$("#landing_page").fadeIn("slow");
							$(".panel-right").hide();
							$("#designing_page").hide();

							$(".panel-right-reveal").hide();
							$("#mobile_wrap").removeClass('panel-closing with-panel-right-reveal');
							location.reload();
					  } else {
					    swal.close();
					  }
					});
				});

				$(".login_email, .login_password").focus(function(){
					$(".signup_social").hide();
				});
				$(".login_email, .login_password").blur(function(){
					$(".signup_social").show();
				});

				$(".signup_fullname, .signup_email, .signup_password, .signup_password2").focus(function(){
					//$(".signup_social").hide();
				});
				$(".signup_fullname, .signup_email, .signup_password, .signup_password2").blur(function(){
					//$(".signup_social").show();
				});

				$(".my-toggle").click(function(){
						var this_ = $(this);
						var area = $(this_).attr("area");
						$("."+area).slideToggle(function(){
							if($("."+area).is(":visible")){
								$(this_).hide();
								$(this_).children("img").attr("src","images/icons/black/up.png");
								$(this_).fadeIn("slow");
							}else{
								$(this_).hide();
								$(this_).children("img").attr("src","images/icons/black/down.png");
								$(this_).fadeIn("slow");
							}
						});
				});

				$("#confirm_order").click(function(){
					if(window.localStorage.getItem('valid_device') == "true"){
						swal({
							title: 'Please wait..',
							text: "We're submitting your order",
							closeOnClickOutside: false,
							buttons: false,
							html: true
						});

						var user_id     	= localStorage.getItem('id');
						var qty  					= $(".qntyshop").val();
						var payment_form	= $("#paymentForm").serialize();
						var shipping			= $("#shippingAddressForm").serialize();


						$.ajax({
							url:   base_url+"new_order.php",
							data: {
								user_id 			: user_id,
								design 				: JSON.stringify(design),
								qty 					: qty,
								shipping 			: shipping,
								payment_form	: payment_form
							},
							type: 'GET',
							dataType: 'html',
							beforeSend: function(xhr){

							},
							success: function(order){
								order = $.parseJSON(order);

								if(order.success == true){
									$(".new_order_id").text(order.id);
									swal({
										title: "Order Successful",
										icon: "success",
										timer: 3000
									}).then((value) => {
										//reset
										design = {};
										design_history = [];

										render_image(design);
										$(".design_sketch").hide();
										$(".design_sketch_empty").fadeIn("slow");

										$("#designing_page").hide();
										$("#order_success_page").fadeIn("slow");
										page = "order_complete";
										window.scrollTo(0, 0);

										var id       = window.localStorage.getItem('id');
										get_orders(id);

									});
								}else{
									swal({
										title: "Unable to submit order",
										text: order.msg,
										icon: "danger",
										timer: 3000
									}).then((value) => {
									});
								}
							},error:function(){
								swal({
									title: "Can not connect with server!",
									text: "Please check your internet connection, and try again.",
									icon: "error"
								});
							}
						});
					}else{
						swal({
							title: "Please login",
							text: "Join Myde Abaya to get started!",
							icon: "warning"
						}).then((value) => {
							$(".popup-login").addClass('active');
						});
					}
				});



			});
			
    },
    receivedEvent: function(id) {}
}
app.initialize();
