package com.teamlog.controller;

import java.util.List;

import javax.inject.Inject;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

import com.teamlog.domain.UserVO;
import com.teamlog.service.UserService;

@Controller
@RequestMapping("/user/*")
public class UserController {
	@Inject
	UserService service;
	
	@RequestMapping(value = "/list", method = RequestMethod.GET)
	public void getList(Model model) throws Exception {
		List<UserVO> list = null;
		list = service.list();
		
		model.addAttribute("list", list);
	}
}
