"use client"
import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Pencil, Trash2, UserPlus } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Search, MoreHorizontal } from "lucide-react"
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Users, User, School, UserCog, CheckCircle, XCircle } from "lucide-react"
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form"

// User form schema
const userFormSchema = z.object({
	name: z.string().min(2, { message: "Nama harus minimal 2 karakter" }),
	email: z.string().email({ message: "Email tidak valid" }),
	role: z.string({ required_error: "Role harus dipilih" }),
	status: z.string({ required_error: "Status harus dipilih" }),
})

type UserFormValues = z.infer<typeof userFormSchema>

// Dummy data pengguna
const dummyUsers = [
	{
		id: 1,
		name: "Alice Johnson",
		email: "alice@example.com",
		role: "Siswa",
		status: "Aktif",
		avatar: "/placeholder-user.jpg",
	},
	{
		id: 2,
		name: "Bob Smith",
		email: "bob@example.com",
		role: "Fasilitator",
		status: "Aktif",
		avatar: "/placeholder-user.jpg",
	},
	{
		id: 3,
		name: "Carol Davis",
		email: "carol@example.com",
		role: "Admin",
		status: "Aktif",
		avatar: "/placeholder-user.jpg",
	},
	{
		id: 4,
		name: "Daniel Brown",
		email: "daniel@example.com",
		role: "Siswa",
		status: "Aktif",
		avatar: "/placeholder-user.jpg",
	},
	{
		id: 5,
		name: "Emily Wilson",
		email: "emily@example.com",
		role: "Siswa",
		status: "Nonaktif",
		avatar: "/placeholder-user.jpg",
	},
	{
		id: 6,
		name: "Frank Miller",
		email: "frank@example.com",
		role: "Fasilitator",
		status: "Nonaktif",
		avatar: "/placeholder-user.jpg",
	},
]

export default function AdminUsersPage() {
	const [searchTerm, setSearchTerm] = useState("")
	const [users, setUsers] = useState(dummyUsers)
	const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
	const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
	const [currentUser, setCurrentUser] = useState<(typeof dummyUsers)[0] | null>(null)
	
	// Form for adding a new user
	const addForm = useForm<UserFormValues>({
		resolver: zodResolver(userFormSchema),
		defaultValues: {
			name: "",
			email: "",
			role: "Siswa",
			status: "Aktif",
		},
	})
	
	// Form for editing an existing user
	const editForm = useForm<UserFormValues>({
		resolver: zodResolver(userFormSchema),
		defaultValues: {
			name: "",
			email: "",
			role: "Siswa",
			status: "Aktif",
		},
	})
	
	// Handling the add user submission
	const onAddUser = (values: UserFormValues) => {
		// Create a new user object
		const newUser = {
			id: users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 1,
			name: values.name,
			email: values.email,
			role: values.role,
			status: values.status,
			avatar: "/placeholder-user.jpg", // Default avatar
		}
		
		// Add the new user to the users array
		setUsers([...users, newUser])
		
		// Close the dialog and reset the form
		setIsAddDialogOpen(false)
		addForm.reset()
	}
	
	// Handling the edit user submission
	const onEditUser = (values: UserFormValues) => {
		if (!currentUser) return
		
		// Update the user object
		const updatedUsers = users.map(user => {
			if (user.id === currentUser.id) {
				return {
					...user,
					name: values.name,
					email: values.email,
					role: values.role,
					status: values.status,
				}
			}
			return user
		})
		
		// Update the users array
		setUsers(updatedUsers)
		
		// Close the dialog, reset the form, and clear the current user
		setIsEditDialogOpen(false)
		setCurrentUser(null)
		editForm.reset()
	}
	
	// Opening the edit dialog and setting the current user
	const handleEdit = (id: number) => {
		const user = users.find(u => u.id === id)
		if (user) {
			setCurrentUser(user)
			editForm.setValue("name", user.name)
			editForm.setValue("email", user.email)
			editForm.setValue("role", user.role)
			editForm.setValue("status", user.status)
			setIsEditDialogOpen(true)
		}
	}

	// Menghitung statistik pengguna berdasarkan role dan status
	const totalUsers = users.length
	const activeUsers = users.filter((user) => user.status === "Aktif").length
	const totalStudents = users.filter((user) => user.role === "Siswa").length
	const activeStudents = users.filter(
		(user) => user.role === "Siswa" && user.status === "Aktif"
	).length
	const totalFacilitators = users.filter(
		(user) => user.role === "Fasilitator"
	).length
	const activeFacilitators = users.filter(
		(user) => user.role === "Fasilitator" && user.status === "Aktif"
	).length
	const totalAdmins = users.filter((user) => user.role === "Admin").length
	const activeAdmins = users.filter((user) => user.role === "Admin" && user.status === "Aktif").length

	const filteredUsers = users.filter(
		(user) =>
			user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
			user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
			user.role.toLowerCase().includes(searchTerm.toLowerCase())
	)

	// Handler for deleting a user
	const handleDelete = (id: number) => {
		if (confirm("Yakin ingin menghapus pengguna ini?")) {
			setUsers(users.filter((u) => u.id !== id))
		}
	}

	return (
		<main className="p-4 md:p-8">
			<Card>
				<CardHeader className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 md:gap-0">
					<div>
						<CardTitle>Kelola Pengguna</CardTitle>
						<p className="text-muted-foreground text-sm mt-1">
							Lihat, cari, dan kelola semua pengguna sistem
						</p>
					</div>
					<div className="flex gap-2 items-center">
						<Input
							placeholder="Cari nama, email, atau role..."
							value={searchTerm}
							onChange={(e) => setSearchTerm(e.target.value)}
							className="w-56"
						/>
						<Button variant="default" size="sm" onClick={() => setIsAddDialogOpen(true)}>
							<UserPlus className="h-4 w-4 mr-2" /> Tambah Pengguna
						</Button>
					</div>
				</CardHeader>
				<CardContent>
					<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 mb-4">
						<Card className="bg-primary/10 border-primary/20">
							<CardContent className="flex items-center p-3">
								<div className="flex-shrink-0">
									<Users className="h-6 w-6 text-primary" />
								</div>
								<div className="ml-2">
									<p className="text-xs text-muted-foreground">Total Pengguna</p>
									<p className="text-sm font-semibold">
										{users.length}
									</p>
								</div>
							</CardContent>
						</Card>
						<Card className="bg-blue-50 border-blue-200 dark:bg-blue-950/30 dark:border-blue-900">
							<CardContent className="flex items-center p-3">
								<div className="flex-shrink-0">
									<UserCog className="h-6 w-6 text-blue-500 dark:text-blue-400" />
								</div>
								<div className="ml-2">
									<p className="text-xs text-muted-foreground">Pengguna Aktif</p>
									<p className="text-sm font-semibold">
										{users.filter((user) => user.status === "Aktif").length}
									</p>
								</div>
							</CardContent>
						</Card>
						<Card className="bg-red-50 border-red-200 dark:bg-red-950/30 dark:border-red-900">
							<CardContent className="flex items-center p-3">
								<div className="flex-shrink-0">
									<XCircle className="h-6 w-6 text-red-500 dark:text-red-400" />
								</div>
								<div className="ml-2">
									<p className="text-xs text-muted-foreground">Nonaktif</p>
									<p className="text-sm font-semibold">
										{users.filter((user) => user.status === "Nonaktif").length}
									</p>
								</div>
							</CardContent>
						</Card>
						<Card className="bg-amber-50 border-amber-200 dark:bg-amber-950/30 dark:border-amber-900">
							<CardContent className="flex items-center p-3">
								<div className="flex-shrink-0">
									<School className="h-6 w-6 text-amber-500 dark:text-amber-400" />
								</div>
								<div className="ml-2">
									<p className="text-xs text-muted-foreground">Siswa</p>
									<p className="text-sm font-semibold">
										{users.filter((user) => user.role === "Siswa").length}
									</p>
								</div>
							</CardContent>
						</Card>
						<Card className="bg-purple-50 border-purple-200 dark:bg-purple-950/30 dark:border-purple-900">
							<CardContent className="flex items-center p-3">
								<div className="flex-shrink-0">
									<User className="h-6 w-6 text-purple-500 dark:text-purple-400" />
								</div>
								<div className="ml-2">
									<p className="text-xs text-muted-foreground">Fasilitator</p>
									<p className="text-sm font-semibold">
										{users.filter((user) => user.role === "Fasilitator").length}
									</p>
								</div>
							</CardContent>
						</Card>
					</div>
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead>Avatar</TableHead>
								<TableHead>Nama</TableHead>
								<TableHead>Email</TableHead>
								<TableHead>Role</TableHead>
								<TableHead>Status</TableHead>
								<TableHead>Aksi</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{filteredUsers.length === 0 ? (
								<TableRow>
									<TableCell
										colSpan={6}
										className="text-center text-muted-foreground"
									>
										Tidak ada pengguna ditemukan.
									</TableCell>
								</TableRow>
							) : (
								filteredUsers.map((user) => (
									<TableRow key={user.id}>
										<TableCell>
											<Avatar className="h-8 w-8">
												<AvatarImage
													src={user.avatar}
													alt={user.name}
												/>
												<AvatarFallback>
													{user.name.substring(0, 2)}
												</AvatarFallback>
											</Avatar>
										</TableCell>
										<TableCell className="font-medium">
											{user.name}
										</TableCell>
										<TableCell>{user.email}</TableCell>
										<TableCell>
											<Badge
												variant={
													user.role === "Admin"
														? "default"
														: user.role === "Fasilitator"
														? "secondary"
														: "outline"
												}
											>
												{user.role}
											</Badge>
										</TableCell>
										<TableCell>
											<Badge
												variant={
													user.status === "Aktif"
														? "default"
														: "destructive"
												}
											>
												{user.status}
											</Badge>
										</TableCell>
										<TableCell>
											<DropdownMenu>
												<DropdownMenuTrigger asChild>
													<Button
														size="icon"
														variant="ghost"
													>
														<MoreHorizontal className="h-4 w-4" />
													</Button>
												</DropdownMenuTrigger>
												<DropdownMenuContent align="end">
													<DropdownMenuLabel>Aksi</DropdownMenuLabel>
													<DropdownMenuItem
														onClick={() => handleEdit(user.id)}
													>
														<Pencil className="h-4 w-4 mr-2" /> Edit
													</DropdownMenuItem>
													<DropdownMenuItem
														onClick={() => handleDelete(user.id)}
													>
														<Trash2 className="h-4 w-4 mr-2" /> Hapus
													</DropdownMenuItem>
												</DropdownMenuContent>
											</DropdownMenu>
										</TableCell>
									</TableRow>
								))
							)}
						</TableBody>
					</Table>
				</CardContent>
			</Card>
			
			{/* Add User Dialog */}
			<Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
				<DialogContent className="sm:max-w-[425px]">
					<DialogHeader>
						<DialogTitle>Tambah Pengguna Baru</DialogTitle>
						<DialogDescription>
							Masukkan informasi pengguna baru di bawah ini.
						</DialogDescription>
					</DialogHeader>
					<Form {...addForm}>
						<form onSubmit={addForm.handleSubmit(onAddUser)} className="space-y-4">
							<FormField
								control={addForm.control}
								name="name"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Nama Lengkap</FormLabel>
										<FormControl>
											<Input placeholder="Masukkan nama lengkap" {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={addForm.control}
								name="email"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Email</FormLabel>
										<FormControl>
											<Input
												type="email"
												placeholder="nama@example.com"
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={addForm.control}
								name="role"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Role</FormLabel>
										<Select
											onValueChange={field.onChange}
											defaultValue={field.value}
										>
											<FormControl>
												<SelectTrigger>
													<SelectValue placeholder="Pilih role" />
												</SelectTrigger>
											</FormControl>
											<SelectContent>
												<SelectItem value="Admin">Admin</SelectItem>
												<SelectItem value="Fasilitator">Fasilitator</SelectItem>
												<SelectItem value="Siswa">Siswa</SelectItem>
											</SelectContent>
										</Select>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={addForm.control}
								name="status"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Status</FormLabel>
										<Select
											onValueChange={field.onChange}
											defaultValue={field.value}
										>
											<FormControl>
												<SelectTrigger>
													<SelectValue placeholder="Pilih status" />
												</SelectTrigger>
											</FormControl>
											<SelectContent>
												<SelectItem value="Aktif">Aktif</SelectItem>
												<SelectItem value="Nonaktif">Nonaktif</SelectItem>
											</SelectContent>
										</Select>
										<FormMessage />
									</FormItem>
								)}
							/>
							<DialogFooter>
								<Button type="submit">Tambah Pengguna</Button>
							</DialogFooter>
						</form>
					</Form>
				</DialogContent>
			</Dialog>

			{/* Edit User Dialog */}
			<Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
				<DialogContent className="sm:max-w-[425px]">
					<DialogHeader>
						<DialogTitle>Edit Pengguna</DialogTitle>
						<DialogDescription>
							Edit informasi pengguna di bawah ini.
						</DialogDescription>
					</DialogHeader>
					<Form {...editForm}>
						<form onSubmit={editForm.handleSubmit(onEditUser)} className="space-y-4">
							<FormField
								control={editForm.control}
								name="name"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Nama Lengkap</FormLabel>
										<FormControl>
											<Input placeholder="Masukkan nama lengkap" {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={editForm.control}
								name="email"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Email</FormLabel>
										<FormControl>
											<Input
												type="email"
												placeholder="nama@example.com"
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={editForm.control}
								name="role"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Role</FormLabel>
										<Select
											onValueChange={field.onChange}
											defaultValue={field.value}
										>
											<FormControl>
												<SelectTrigger>
													<SelectValue placeholder="Pilih role" />
												</SelectTrigger>
											</FormControl>
											<SelectContent>
												<SelectItem value="Admin">Admin</SelectItem>
												<SelectItem value="Fasilitator">Fasilitator</SelectItem>
												<SelectItem value="Siswa">Siswa</SelectItem>
											</SelectContent>
										</Select>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={editForm.control}
								name="status"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Status</FormLabel>
										<Select
											onValueChange={field.onChange}
											defaultValue={field.value}
										>
											<FormControl>
												<SelectTrigger>
													<SelectValue placeholder="Pilih status" />
												</SelectTrigger>
											</FormControl>
											<SelectContent>
												<SelectItem value="Aktif">Aktif</SelectItem>
												<SelectItem value="Nonaktif">Nonaktif</SelectItem>
											</SelectContent>
										</Select>
										<FormMessage />
									</FormItem>
								)}
							/>
							<DialogFooter>
								<Button type="submit">Simpan Perubahan</Button>
							</DialogFooter>
						</form>
					</Form>
				</DialogContent>
			</Dialog>
		</main>
	)
}
